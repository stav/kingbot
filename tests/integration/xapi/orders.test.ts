import { deadline, delay } from 'std/async/mod.ts'
import { assertEquals, assert } from 'std/testing/asserts.ts'
import { afterEach, beforeEach, describe, it } from "std/testing/bdd.ts"
import * as logging from 'std/log/mod.ts'

import type { XapiExchangeAccount } from 'lib/config.d.ts'
import type { Asset } from 'lib/config.d.ts'
import { Exchange } from 'lib/config.ts'

import type { TICK_RECORD, TRADE_TRANS_INFO } from 'src/bot/xapi/xapi.d.ts'
import { CMD_FIELD, TYPE_FIELD } from 'src/bot/xapi/xapi.ts'
import XapiSocket from 'src/bot/xapi/socket/socket.ts'
import XConn from "src/bot/xapi/xconn.ts"

await logging.setup({ loggers: { default: { level: "WARNING" } } })

const TEST_INDEX = 0 // TODO config
const ASSETS = [ { symbol: "GOLD", volume: 0.01, digits: 2 } as Asset ]

function genHedgeOrders (assets: Asset[], records: TICK_RECORD[]): TRADE_TRANS_INFO[] {
  const tpRates = [ 0.002, 0.004, 0.006 ]
  const timestamp = Date.now()
  const orders: TRADE_TRANS_INFO[] = []
  const _order = {
    type: TYPE_FIELD.OPEN,
    expiration: timestamp + 1000 * 2, // two seconds
    offset: 0,
    order: 0,
  }

  for (const record of records) {
    const asset = assets.find(a => a.symbol === record.symbol)
    const volume = asset?.volume ?? 0.01
    const mod = asset?.modify ?? 1
    const ask = record.ask
    const bid = record.bid
    const buyPrice = parseFloat((ask + ask * 0.001 * mod).toFixed(asset?.digits))
    const sellPrice = parseFloat((bid - bid * 0.001 * mod).toFixed(asset?.digits))
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
  // deno-lint-ignore no-explicit-any
  const symbols = ASSETS.map((a: any) => a.symbol)
  const prices = await socket.getPriceQuotes(symbols)
  return genHedgeOrders(ASSETS, prices)
}

describe("Orders", () => {

  const account = Exchange().Accounts[TEST_INDEX] as XapiExchangeAccount

  let conn: XConn

  beforeEach(async () => {
    conn = new XConn(account)
    await conn.Socket.open()
    await conn.Socket.login()
  })

  afterEach(async () => {
    conn.Socket.close()
    async function wait () { while (!conn.Socket.isClosed) await delay(200) }
    await deadline(wait(), 2000)
  })

  it("should generate six orders", async function () {
    const orders = await getHedgeOrders(conn.Socket)
    const result = await Promise.all(
      orders.map(
        order => conn.Socket.sync({
          command: 'tradeTransaction',
          arguments: { tradeTransInfo: order },
        })
      )
    )
    assertEquals(result.length, 6)
    assert(result.every(r => r.status))
  });

});
