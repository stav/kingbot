import { delay } from 'std/async/mod.ts'
import { serve } from 'std/http/server.ts'
import { getLogger } from 'std/log/mod.ts'

import Logging from 'lib/logging.ts'

import type { KingConn } from '../conn.d.ts'

import type XConn from '../xapi/xconn.ts'
import type { STREAMING_TRADE_STATUS_RECORD, TRADE_TRANS_INFO } from '../xapi/xapi.d.ts'
import { CMD_FIELD, TYPE_FIELD } from '../xapi/xapi.ts'

import type { TelethonMessage, TelegramSignal } from './parsers/parsers.d.ts'
import { parse } from './parsers/mod.ts'

/**
 * HTTP server listening for signals from Telethon client
 * @todo Generalize usage: right now it's hardcoded for XTB
 */
export default class Server {

  #ctl = new AbortController()

  private connections: KingConn[] = []

  public connected = false

  async handler (request: Request) {
    try {
      const payload = await request.json() as TelethonMessage
      const signal = await parse(payload)
      const traded = await this.trade(payload.eindex, signal)
      return new Response(Deno.inspect(traded))
    }
    catch (error) {
      return new Response(error)
    }
  }

  connect (connections: KingConn[]) {
    this.connections = connections
    serve( this.handler.bind(this), { signal: this.#ctl.signal } )
    this.connected = true
    const url = 'http://localhost:8000'
    // const account = Deno.inspect(this.connection.Socket.account)
    return `Listening to ${url} for ${connections.length - 1} connections`
  }

  /** Open the underlying socket and login */
  async login (connection: XConn) {
    // if (this.connection?.Socket.session) { return } // Already logged in
    await connection.Socket.open()
    await connection.Socket.login()
  }

  async trade (eindex: number, signal: TelegramSignal) {
    const logger = getLogger('tserver')

    logger.info('ServerTradeSignal', this.connected, eindex, signal)
    Logging.flush()

    const connection = this.connections[eindex] as XConn
    if (!connection) {
      logger.error('Closed connection', connection, 'at index', eindex, 'for signal', signal)
      Logging.flush()
      return
    }

    await this.login(connection)
    await delay(1000) // Grease the wheels

    const socket = connection.Socket
    const trades = signal.tps.map(
      tp => ({
        cmd:           CMD_FIELD[`${signal.type}_STOP`],
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

  close () {
    this.#ctl.abort()
    this.connected = false
  }

}
