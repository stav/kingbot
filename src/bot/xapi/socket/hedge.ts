import { getLogger } from 'std/log/mod.ts'

import type { Asset } from 'lib/config.d.ts'
import { input } from 'lib/config.ts'
import Logging from 'lib/logging.ts'

import type { TICK_RECORD, TRADE_TRANS_INFO } from '../xapi.d.ts'
import { CMD_FIELD, TYPE_FIELD } from '../xapi.ts'

import XapiSocket from './socket.ts'

function genHedgeOrders (assets: Asset[], records: TICK_RECORD[]): TRADE_TRANS_INFO[] {

  const tlogger = getLogger('traders')
  tlogger.debug('genHedgeOrders', assets, records)
  Logging.flush()

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
    const rates = asset?.rates ?? [ 0.002, 0.004, 0.006 ]
    const volume = asset?.volume ?? 0.01
    const mod = asset?.modify ?? 1
    const ask = record.ask
    const bid = record.bid
    const buyPrice = parseFloat((ask + ask * 0.001 * mod).toFixed(asset?.digits))
    const sellPrice = parseFloat((bid - bid * 0.001 * mod).toFixed(asset?.digits))
    let tpLevel = 0

    for (const rate of rates) {
      const order = Object.assign({}, _order, {
        customComment: 'K1NGbot ' + timestamp + ' TP' + ++tpLevel,
        symbol: record.symbol,
        volume,
      })
      orders.push(Object.assign({}, order, {
        cmd: CMD_FIELD.BUY_STOP,
        price: buyPrice,
        tp: parseFloat((buyPrice + buyPrice * rate * mod).toFixed(asset?.digits)),
        sl: parseFloat((ask * 0.96).toFixed(asset?.digits)),
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

async function getHedgeOrders (socket: XapiSocket): Promise<TRADE_TRANS_INFO[]> {
  const assets = input().Hedge.Assets
  // deno-lint-ignore no-explicit-any
  const symbols = assets.map((a: any) => a.symbol)
  const prices = await socket.getPriceQuotes(symbols)
  return genHedgeOrders(assets, prices)
}

export default async function hedge (this: XapiSocket) {
  const orders = await getHedgeOrders(this)
  console.log('Requesting', orders.length, 'orders')
  const results = await this.makeTrades(orders)
  return `Requested ${results.length} orders`
}
