import { assertEquals } from 'std/testing/asserts.ts'
import * as logging from 'std/log/mod.ts'

import type { STREAMING_TRADE_RECORD } from 'src/bot/xapi/xapi.d.ts'
import { testing } from 'src/bot/xapi/socket/profits.ts'
import { CMD_FIELD } from 'src/bot/xapi/xapi.ts'

const { getLevel, getStopLoss } = testing

await logging.setup({ loggers: { default: { level: "WARNING" } } })

Deno.test('profits:getLevel', () => {

  let data = {
    cmd: CMD_FIELD.BUY,
    close_price: 2,
    open_price: 1,
    sl: 0,
  } as STREAMING_TRADE_RECORD
  assertEquals(getLevel(data), 1)

  data = {
    cmd: CMD_FIELD.BUY,
    close_price: 3,
    open_price: 1,
    sl: 1,
  } as STREAMING_TRADE_RECORD
  assertEquals(getLevel(data), 2)

  data = {
    cmd: CMD_FIELD.SELL,
    close_price: 2,
    open_price: 4,
    sl: 5,
  } as STREAMING_TRADE_RECORD
  assertEquals(getLevel(data), 4)

  data = {
    cmd: CMD_FIELD.SELL,
    close_price: 1,
    open_price: 4,
    sl: 4,
  } as STREAMING_TRADE_RECORD
  assertEquals(getLevel(data), 2.5)

})

Deno.test('profits:getStopLoss', () => {

  let data = {
    cmd: CMD_FIELD.BUY,
    close_price: 2,
    open_price: 1,
    digits: 1,
    sl: 0,
  } as STREAMING_TRADE_RECORD
  assertEquals(getStopLoss(data), 1)

  data = {
    cmd: CMD_FIELD.BUY,
    close_price: 3,
    open_price: 1,
    digits: 4,
    sl: 1,
  } as STREAMING_TRADE_RECORD
  assertEquals(getStopLoss(data), 2.0006)

  data = {
    cmd: CMD_FIELD.BUY,
    close_price: 3,
    open_price: 1,
    digits: 0,
    sl: 1,
  } as STREAMING_TRADE_RECORD
  assertEquals(getStopLoss(data), 2)

})
