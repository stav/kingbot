import { serve } from 'std/http/server.ts'

import type { KingConn } from '../conn.d.ts'

import type XConn from '../xapi/xconn.ts'
import type { STREAMING_TRADE_STATUS_RECORD, TRADE_TRANS_INFO } from '../xapi/xapi.d.ts'
import { CMD_FIELD, TYPE_FIELD } from '../xapi/xapi.ts'

import type { TelethonMessage, TelegramSignal } from './parsers/parsers.d.ts'
import { parse } from './parsers/mod.ts'

export default class Server {

  #ctl = new AbortController()

  private connection: XConn | null = null

  public connected = false

  async handler (request: Request) {
    try {
      const payload = await request.json() as TelethonMessage
      const signal = await parse(payload)
      const traded = await this.trade(signal)
      return new Response(Deno.inspect(traded))
    }
    catch (error) {
      return new Response(error)
    }
  }

  connect (connection: KingConn | null) {
    this.connection = connection as XConn
    serve( this.handler.bind(this), { signal: this.#ctl.signal } )
    this.connected = true
    const url = 'http://localhost:8000'
    const account = Deno.inspect(this.connection.Socket.account)
    return `Listening to ${url} for ${account}`
  }

  /** Make sure the target connection is logged in */
  async login () {
    // if (this.connection?.Socket.session) { return } // Already logged in
    await this.connection?.Socket.open()
    await this.connection?.Socket.login()
  }

  async trade (signal: TelegramSignal) {
    console.log('tttradee', signal, this.connected)
    await this.login()
    if (!this.connection) { return }
    const socket = this.connection.Socket
    const results = [] as STREAMING_TRADE_STATUS_RECORD[]

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
      console.log('server-trade-result', data, result)
      results.push(result)
    }
    return results
  }

  close () {
    this.#ctl.abort()
    this.connected = false
  }

}
