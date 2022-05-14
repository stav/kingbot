import { spy, assertSpyCall, assertSpyCalls } from 'std/testing/mock.ts'
import { assertStrictEquals } from 'std/testing/asserts.ts'
import { delay } from 'std/async/mod.ts'
import * as logging from 'std/log/mod.ts'

import type { STREAMING_TRADE_STATUS_RECORD } from 'src/bot/xapi/xapi.d.ts'
import type { TelegramSignal } from 'src/bot/telegram/parsers/parsers.d.ts'
import type { KingConn } from 'src/bot/conn.d.ts'
import TConn from 'src/bot/telegram/telegram.ts'

await logging.setup({ loggers: { default: { level: "WARNING" } } })

async function trade (_eindex: number, _signal: TelegramSignal) {
  await delay(1)
  return null as unknown as STREAMING_TRADE_STATUS_RECORD[]
}

const data = {
  cid: -0,
  fid: -0,
  date: Date.now(),
  eindexes: [1, 2, 3],
  msg: undefined,
}
function init (body: any = data) {
  return {
    method: 'POST',
    body: JSON.stringify(body),
  }
}

Deno.test('Telegram', async () => {

  // Construct
  const tconn = new TConn()
  assertStrictEquals(tconn.prompt(), '-')
  assertStrictEquals(tconn.connected, false)

  // Setup
  let nconns: number = tconn.setup([])
  assertStrictEquals(nconns, 0)
  const conns = [null as unknown as KingConn]
  nconns = tconn.setup(conns)
  assertStrictEquals(nconns, 1)

  // Connect
  tconn.server.connect(conns, 8001)
  assertStrictEquals(tconn.connected, true)

  // Serve
  let response = await fetch('http://localhost:8001', init())
  assertStrictEquals(response.ok, true)
  const errorMessage = await response.text()
  assertStrictEquals(errorMessage.startsWith('Error: No parsers available for data'), true)

  // Trade
  const tradeSpy = spy(trade)
  tconn.server.trade = tradeSpy
  const msg = 'GOLD/XAUUSD SELL 1933\nSL 1943\nTP 1930\nTP 1923\nTP 1910\nTP 1900'
  const body = Object.assign({}, data, { msg })
  response = await fetch('http://localhost:8001', init(body))
  assertStrictEquals(response.ok, true)
  await response.body?.cancel()
  assertSpyCalls(tradeSpy, 3)

  // Close
  tconn.close()
  await delay(10)
  assertStrictEquals(tconn.connected, false)
})
