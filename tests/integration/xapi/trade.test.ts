import { deadline, delay } from 'std/async/mod.ts'
import * as logging from 'std/log/mod.ts'

import { Rhum } from 'rhum/mod.ts'

import type { XapiExchangeAccount } from 'lib/config.d.ts'
import { Exchange } from 'lib/config.ts'

import XConn from 'src/bot/xapi/xconn.ts'

import type { TRADE_TRANS_INFO, STREAMING_TRADE_STATUS_RECORD } from 'src/bot/xapi/xapi.d.ts'
import { CMD_FIELD, TYPE_FIELD, REQUEST_STATUS_FIELD } from 'src/bot/xapi/xapi.ts'

await logging.setup({ loggers: { default: { level: "WARNING" } } })

const TEST_INDEX = 0 // TODO config

Rhum.testSuite('connection', () => {

  const account = Exchange().Accounts[TEST_INDEX] as XapiExchangeAccount

  const sellTrade = {
    order: 0,
    offset: 0,
    symbol: 'GOLD',
    cmd: CMD_FIELD.SELL_STOP,
    price: 1000,
    sl: 1010,
    tp: 980,
    type: TYPE_FIELD.OPEN,
    volume: 0.01,
  } as TRADE_TRANS_INFO

  Rhum.testCase('should get no trades: unconnected', async () => {
    const conn = new XConn(account)
    const trades = await conn.Socket.trades()
    Rhum.asserts.assertStrictEquals( trades.length, 0 )
  })

  Rhum.testCase('should make a trade and delete it', async () => {
    const conn = new XConn(account)

    // Login
    await conn.Socket.open()
    await conn.Socket.login()

    // Make the trade
    let result = await conn.Socket.trade(sellTrade) as STREAMING_TRADE_STATUS_RECORD

    // Assert trade result was accepted
    if (!result) return // Make sure we didn't get an error
    Rhum.asserts.assertStrictEquals( result.requestStatus, REQUEST_STATUS_FIELD.ACCEPTED )

    // Assert there is at least one trade
    const trades = await conn.Socket.trades()
    Rhum.asserts.assertNotEquals( trades.length, 0 )

    // Delete the order
    const deleteTrade = Object.assign( {}, sellTrade, {
      order: result.order,
      type: TYPE_FIELD.DELETE,
    } as TRADE_TRANS_INFO)
    result = await conn.Socket.trade(deleteTrade) as STREAMING_TRADE_STATUS_RECORD

    // Close the connection
    conn.Socket.close()
    async function wait () { while (!conn.Socket.isClosed) await delay(200) }
    await deadline(wait(), 2000)

    // Assert delete result was accepted
    Rhum.asserts.assertStrictEquals( result.requestStatus, REQUEST_STATUS_FIELD.ACCEPTED )

  })

})

Rhum.run()
