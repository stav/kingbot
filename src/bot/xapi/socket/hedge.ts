import type { Asset } from 'lib/config.d.ts'
import { input } from 'lib/config.ts'

import type { TICK_RECORD, TRADE_TRANS_INFO } from '../xapi.d.ts'
import { CMD_FIELD, TYPE_FIELD } from '../xapi.ts'

import type { XapiResponse, XapiDataResponse, SyncFunction } from './socket.d.ts'
import XapiSocket from './socket.ts'

import Logging from 'lib/logging.ts'

async function fetchHedgePrices(sync: SyncFunction, symbols: string[]): Promise<TICK_RECORD[]> {
  const data = {
    command: 'getTickPrices',
    arguments: {
      level: 0,
      symbols,
      timestamp: 0,
    }
  }
  const response: XapiResponse = await sync(data)
  if (response.status)
    return (<XapiDataResponse>response).returnData.quotations
  else {
    console.error(response)
    return []
  }
}

function genHedgeOrders (assets: Asset[], records: TICK_RECORD[]): TRADE_TRANS_INFO[] {
  const logger = Logging.logger()
  const tpRates = [ 0.005, 0.007, 0.009 ]
  const timestamp = Date.now()
  const orders: TRADE_TRANS_INFO[] = []
  const _order = {
    type: TYPE_FIELD.OPEN,
    expiration: timestamp + 60000 * 60 * 24 * 365,
    offset: 0,
    order: 0,
  }

  for (const record of records) {
    const asset = assets.find(a => a.symbol === record.symbol)
    const volume = asset?.volume || 0.01
    const mod = asset?.modify || 1
    const bid = record.bid
    const buyPrice = parseFloat((bid + bid * 0.002 * mod).toFixed(asset?.digits))
    const sellPrice = parseFloat((bid - bid * 0.001 * mod).toFixed(asset?.digits))
    logger.info('Spread', record.symbol, buyPrice - sellPrice)
    let tpLevel = 0

    for (const rate of tpRates) {
      const order = Object.assign({}, _order, {
        customComment: 'K1NGbot ' + timestamp + ' TP' + ++tpLevel,
        symbol: record.symbol,
        volume,
      })
      orders.push(Object.assign({}, order, {
        cmd: CMD_FIELD.BUY_STOP,
        price: buyPrice,
        tp: parseFloat((buyPrice + buyPrice * rate * mod).toFixed(asset?.digits)),
        sl: parseFloat((bid * 0.96).toFixed(asset?.digits)),
      }))
      orders.push(Object.assign({}, order, {
        cmd: CMD_FIELD.SELL_STOP,
        price: sellPrice,
        tp: parseFloat((sellPrice - sellPrice * rate * mod).toFixed(asset?.digits)),
        sl: parseFloat((bid * 1.04).toFixed(asset?.digits)),
      }))
    }
  }
  return orders
}

async function getHedgeOrders (sync: SyncFunction): Promise<TRADE_TRANS_INFO[]> {
  const assets = input().Hedge.Assets
  const symbols = assets.map((a: any) => a.symbol)
  const prices = await fetchHedgePrices(sync, symbols)
  const orders = genHedgeOrders(assets, prices)
  return orders
}

export default async function hedge (this: XapiSocket) {
  const orders = await getHedgeOrders(this.sync.bind(this))
  console.log('Creating', orders.length, 'orders', orders)
  // for (const order of orders) {
  for (let i=0; i<orders.length; i++) {
    const order = orders[i]
    this.send({
      command: 'tradeTransaction',
      arguments: { tradeTransInfo: order },
      customTag: `Order#${i+1}`
    })
  }
  return `Requested ${orders.length} orders`
}
