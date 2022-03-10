import { serve } from 'std/http/server.ts'
import { getLogger } from 'std/log/mod.ts'

import Logging from 'lib/logging.ts'

import type { KingConn } from '../conn.d.ts'

import type XConn from '../xapi/xconn.ts'
import type { STREAMING_TRADE_STATUS_RECORD, TRADE_TRANS_INFO } from '../xapi/xapi.d.ts'
import { CMD_FIELD, REQUEST_STATUS_FIELD, TYPE_FIELD } from '../xapi/xapi.ts'

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
    const klogger = getLogger()
    const tlogger = getLogger('tserver')

    tlogger.info('ServerTradeSignal', this.connected, eindex, signal)
    Logging.flush()

    const connection = this.connections[eindex] as XConn
    const results = [] as STREAMING_TRADE_STATUS_RECORD[]
    const socket = connection.Socket

    if (!connection) { return }

    await this.login(connection)

    for (const tp of signal.tps) {
      const data = {
        cmd:           CMD_FIELD[`${signal.type}_STOP`],
        customComment:'Kingbot Telegram Signal',
        expiration:    Date.now() + 60000 * 60 * 24 * 365,
        offset:        0,
        order:         0,
        price:         signal.entry,
        sl:            signal.sl,
        symbol:        signal.symbol,
        tp:            tp,
        type:          TYPE_FIELD.OPEN,
        volume:        signal.volume,
      } as TRADE_TRANS_INFO

      const result = await socket.trade(data) as STREAMING_TRADE_STATUS_RECORD
      results.push(result)

      klogger.info('ServerTradeResult', data, result)
      tlogger.info(
        data.customComment,
        data.symbol,
        `@${data.price}`,
        `=${data.tp}`,
        'order', result.order,
        REQUEST_STATUS_FIELD[result.requestStatus as REQUEST_STATUS_FIELD],
        result.message ? result.message : '',
      )
      Logging.flush()
    }
    return results
  }

  close () {
    this.#ctl.abort()
    this.connected = false
  }

}
