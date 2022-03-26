import * as logging from 'std/log/mod.ts'

import { Rhum } from 'rhum/mod.ts'

import type { STREAMING_TRADE_RECORD, TRADE_RECORD } from 'src/bot/xapi/xapi.d.ts'
import { CMD_FIELD } from 'src/bot/xapi/xapi.ts'

import type XapiSocket from 'src/bot/xapi/socket/socket.ts'
import { testing } from 'src/bot/xapi/socket/profits.ts'

const { getLevel, getStopLoss, setFamilyStoploss, check } = testing

await logging.setup({ loggers: { default: { level: "WARNING" } } })

Rhum.testPlan("profits", () => {

  const tpData = {
    close_price: 16294.86,
    close_time: 1638907147065,
    closed: true,
    cmd: CMD_FIELD.SELL,
    comment: '[T/P]',
    digits: 2,
    open_price: 16295.77,
    open_time: 1638906046869,
    order2: 497200723,
    order: 144310429,
    position: 497200573,
    profit: 0.16,
    sl: 16322.57,
    state: 'Modified',
    symbol: 'US100',
    tp: 16295.21,
    type: 2,
    volume: 0.01,
  } as STREAMING_TRADE_RECORD

  Rhum.testSuite("getLevel", () => {

    Rhum.testCase("should find stop loss for buy tp1", () => {
      const data = {
        cmd: CMD_FIELD.BUY,
        close_price: 2,
        open_price: 1,
        sl: 0,
      } as STREAMING_TRADE_RECORD
      Rhum.asserts.assertEquals( getLevel(data), 1 )
    })
    Rhum.testCase("should find stop loss for buy tp2", () => {
      const data = {
        cmd: CMD_FIELD.BUY,
        close_price: 3,
        open_price: 1,
        sl: 1,
      } as STREAMING_TRADE_RECORD
      Rhum.asserts.assertEquals( getLevel(data), 2 )
    })
    Rhum.testCase("should find stop loss for sell tp1", () => {
      const data = {
        cmd: CMD_FIELD.SELL,
        close_price: 2,
        open_price: 4,
        sl: 5,
      } as STREAMING_TRADE_RECORD
      Rhum.asserts.assertEquals( getLevel(data), 4 )
    })
    Rhum.testCase("should find stop loss for sell tp2", () => {
      const data = {
        cmd: CMD_FIELD.SELL,
        close_price: 1,
        open_price: 4,
        sl: 4,
      } as STREAMING_TRADE_RECORD
      Rhum.asserts.assertEquals( getLevel(data), 2.5 )
    })

  })

  Rhum.testSuite("getStopLoss", () => {

    Rhum.testCase("should calculate stop loss for buy tp1", () => {
      const data = {
        cmd: CMD_FIELD.BUY,
        close_price: 2,
        open_price: 1,
        digits: 1,
        sl: 0,
      } as STREAMING_TRADE_RECORD
      Rhum.asserts.assertEquals( getStopLoss(data), 1 )
    })
    Rhum.testCase("should calculate stop loss for buy tp2 4 digits", () => {
      const data = {
        cmd: CMD_FIELD.BUY,
        close_price: 3,
        open_price: 1,
        digits: 4,
        sl: 1,
      } as STREAMING_TRADE_RECORD
      Rhum.asserts.assertEquals( getStopLoss(data), 2.0006 )
    })
    Rhum.testCase("should calculate stop loss for buy tp2 zero digits", () => {
      const data = {
        cmd: CMD_FIELD.BUY,
        close_price: 3,
        open_price: 1,
        digits: 0,
        sl: 1,
      } as STREAMING_TRADE_RECORD
      Rhum.asserts.assertEquals( getStopLoss(data), 2 )
    })

  })

  Rhum.testSuite("setFamilyStoploss", () => {

    class XapiSocketMock {
      async sync (_data: unknown) {}
    }
    // deno-lint-ignore no-explicit-any
    let xsocketMock: any
    Rhum.beforeEach(() => {
      xsocketMock = Rhum.mock(XapiSocketMock).create()
    })

    Rhum.testCase("should attempt to modify no orders in the family", async () => {
      Rhum.asserts.assertEquals( xsocketMock.calls.sync, 0 )
      await setFamilyStoploss(tpData, [], xsocketMock as unknown as XapiSocket)
      Rhum.asserts.assertEquals( xsocketMock.calls.sync, 0 )
    })

    Rhum.testCase("should attempt to modify one order in the family", async () => {
      Rhum.asserts.assertEquals( xsocketMock.calls.sync, 0 )
      const trades = [ {} as TRADE_RECORD ]
      await setFamilyStoploss(tpData, trades, xsocketMock as unknown as XapiSocket)
      Rhum.asserts.assertEquals( xsocketMock.calls.sync, 1 )
    })

    Rhum.testCase("should attempt to modify nine orders in the family", async () => {
      Rhum.asserts.assertEquals( xsocketMock.calls.sync, 0 )
      const trades = new Array(9).fill( {} as TRADE_RECORD )
      await setFamilyStoploss(tpData, trades, xsocketMock as unknown as XapiSocket)
      Rhum.asserts.assertEquals( xsocketMock.calls.sync, 9 )
    })

  })

  Rhum.testSuite("check", () => {

    let xSocketMock: XapiSocket

    class XapiSocketMock {
      check = check
      getOpenTrades = (_arg: boolean) => []
    }

    Rhum.beforeEach(() => {
      xSocketMock = Rhum.mock(XapiSocketMock).create() as unknown as XapiSocket
    })

    Rhum.testCase("should do nothing", async () => {
      await xSocketMock.check({ closed: false } as STREAMING_TRADE_RECORD)
      Rhum.asserts.assertEquals( xSocketMock.calls.getOpenTrades, 0 )
    })

    Rhum.testCase("should get trades only once", async () => {
      await xSocketMock.check(tpData)
      Rhum.asserts.assertEquals( xSocketMock.calls.getOpenTrades, 1 )
    })

  })

})

Rhum.run()
