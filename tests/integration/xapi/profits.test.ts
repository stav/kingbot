import { spy, assertSpyCall, assertSpyCalls } from 'std/testing/mock.ts'
import { beforeEach, describe, it } from 'std/testing/bdd.ts'
import { assertEquals } from 'std/testing/asserts.ts'

import { delay } from 'std/async/mod.ts'
import * as logging from 'std/log/mod.ts'

import type { XapiExchangeAccount } from 'lib/config.d.ts'
import { Exchange } from 'lib/config.ts'

import type {
  STREAMING_TRADE_RECORD,
  STREAMING_TRADE_STATUS_RECORD,
  TRADE_RECORD,
  TRADE_TRANS_INFO,
} from 'src/bot/xapi/xapi.d.ts'
import { CMD_FIELD } from 'src/bot/xapi/xapi.ts'
import XapiSocket from 'src/bot/xapi/socket/socket.ts'

await logging.setup({ loggers: { default: { level: 'WARNING' } } })

const TEST_INDEX = 0 // TODO config

describe('Profits', () => {

  let Socket: XapiSocket

  const account = Exchange().Accounts[TEST_INDEX] as XapiExchangeAccount

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
    symbol: 'GOLD',
    tp: 16295.21,
    type: 2,
    volume: 0.01,
  } as STREAMING_TRADE_RECORD

  let called: { [index: string]: boolean }

  function getNoTrades (_o?: boolean): Promise<TRADE_RECORD[]> {
    return new Promise(resolve => {
      called.getOpenTrades = true
      resolve([])
    })
  }

  function getOneTrade (_o?: boolean): Promise<TRADE_RECORD[]> {
    return new Promise(resolve => {
      called.getOpenTrades = true
      resolve([tpData])
    })
  }

  function setFamilyStoploss (_tpData: STREAMING_TRADE_RECORD, _trades: TRADE_RECORD[]): Promise<void> {
    return new Promise(resolve => resolve())
  }

  function makeTrade (_trade: TRADE_TRANS_INFO): Promise<STREAMING_TRADE_STATUS_RECORD> {
    return new Promise(resolve => {
      resolve({} as STREAMING_TRADE_STATUS_RECORD)
    })
  }

  beforeEach(() => {
    Socket = new XapiSocket(account as XapiExchangeAccount)
    called = {
      getOpenTrades: false,
    }
  })

  it('no trades', async () => {
    const familySpy = spy(setFamilyStoploss)
    Socket.getOpenTrades = getNoTrades
    await Socket.check(tpData, familySpy)
    assertEquals(called.getOpenTrades, true)
    assertSpyCalls(familySpy, 0)
  })

  it('one trade', async () => {
    const familySpy = spy(setFamilyStoploss)
    Socket.getOpenTrades = getOneTrade
    await Socket.open()
    await Socket.login()
    await Socket.check(tpData, familySpy)
    assertEquals(called.getOpenTrades, true)
    assertSpyCalls(familySpy, 1)
    assertSpyCall(familySpy, 0, { args: [tpData, [tpData]] })
    Socket.close()
    await delay(200)
  })

  it('make trade', async () => {
    const stopLoss = {
      cmd: 1,
      order: 144310429,
      price: 16295.77,
      sl: 16290.88,
      symbol: "GOLD",
      tp: 16295.21,
      type: 3,
      volume: 0.01,
    } as TRADE_TRANS_INFO
    const makeSpy = spy(makeTrade)
    Socket.makeTrade = makeSpy
    Socket.getOpenTrades = getOneTrade
    await Socket.open()
    await Socket.login()
    await Socket.check(tpData)
    assertSpyCalls(makeSpy, 1)
    assertSpyCall(makeSpy, 0, { args: [stopLoss] })
    Socket.close()
    await delay(200)
  })

})
