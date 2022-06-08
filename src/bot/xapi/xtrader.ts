import { delay } from 'std/async/mod.ts'

import type { TelegramSignal } from '../telegram/parsers/parsers.d.ts'

import type { STREAMING_TRADE_STATUS_RECORD, TRADE_TRANS_INFO } from './xapi.d.ts'
import { CMD_FIELD, TYPE_FIELD } from './xapi.ts'
import XapiSocket from "./socket/socket.ts"

/** Open the underlying socket and login */
async function login (socket: XapiSocket) {
  // if (this.connection?.Socket.session) { return } // Already logged in
  await socket.open()
  await socket.login()
  await delay(1000) // Grease the wheels TODO remove me
}

/** Make the trade with the given socket */
export async function trade (socket: XapiSocket, signal: TelegramSignal) {
  await login(socket)
  const trades = signal.tps.map(
    tp => ({
      cmd:           CMD_FIELD[signal.type],
      customComment:'Kingbot Telegram Signal',
      expiration:    Date.now() + 60000 * 60 * 24 * 365, // 1 year
      offset:        0,
      order:         0,
      symbol:        signal.symbol,
      price:         signal.entry,
      sl:            signal.sl,
      tp,
      type:          TYPE_FIELD.OPEN,
      volume:        signal.volume,
    } as TRADE_TRANS_INFO)
  )
  return await socket.makeTrades(trades) as STREAMING_TRADE_STATUS_RECORD[]
}
