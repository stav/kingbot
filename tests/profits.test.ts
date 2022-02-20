import * as logging from 'std/log/mod.ts'

import { Rhum } from 'rhum/mod.ts'

import type { STREAMING_TRADE_RECORD } from 'src/bot/xapi/xapi.d.ts'
import { testing } from 'src/bot/xapi/socket/profits.ts'
import { CMD_FIELD } from 'src/bot/xapi/xapi.ts'

const { getLevel, getStopLoss } = testing

await logging.setup({ loggers: { default: { level: "WARNING" } } })

Rhum.testPlan("profits", () => {

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

})

Rhum.run()
