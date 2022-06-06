import { delay } from 'std/async/mod.ts'
import { serve } from 'std/http/server.ts'
import { getLogger } from 'std/log/mod.ts'

import type { TelegramChatMap } from 'lib/config.d.ts'
import { Telegram } from 'lib/config.ts'
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

  #chatMap: TelegramChatMap = {}

  private connections: KingConn[] = []

  public connected = false

  #getChannel (cid: number) {
    const ids = Object.keys(this.#chatMap)
    const id = cid in ids ? cid : +ids.filter(id => id.includes(String(cid)))[0]
    const title = this.#chatMap[id]
    return `${cid} ${id} ${title}`
  }

  #getFrom (from: string) {
    if (!from) return '??'
    const ids = Object.keys(this.#chatMap)
    const frids = from.match(/\d+/)    // ["374139448"]
    const frid = frids ? frids[0] : '' // "374139448"
    const id = frid in ids ? +frid : +ids.filter(id => id.includes(frid))[0]
    const title = this.#chatMap[id]
    return `${from} ${id} ${title}`
  }

  async handler (request: Request) {
    const logger = getLogger('tserver')
    const payload = await request.json() as TelethonMessage
    logger.info('Received payload', payload)
    try {
      const trades: STREAMING_TRADE_STATUS_RECORD[][] = []
      const signal = await parse(payload)
      const log = {
        signal,
        account: payload.account,
        connection: this.connected,
        eindexes: payload.eindexes,
        channel: this.#getChannel(payload.cid),
        from: this.#getFrom(payload.fid),
      }
      logger.info('Telegram-server-signal', JSON.stringify(log))
      for (const eindex of payload.eindexes) {
        trades.push(await this.trade(eindex, signal) as STREAMING_TRADE_STATUS_RECORD[])
      }
      getLogger().info('TServer trades response', { trades })
      return new Response(Deno.inspect(trades))
    }
    catch (error) {
      return new Response(error)
    }
    finally {
      Logging.flush()
    }
  }

  connect (connections: KingConn[], port = 8000) {
    this.#chatMap = Telegram().ChatMap
    this.connections = connections
    serve( this.handler.bind(this), { port, signal: this.#ctl.signal } )
    this.connected = true
    // const url = 'http://localhost:8000'
    return `I am aware of ${connections.length - 1} exchange connections`
  }

  /** Open the underlying socket and login */
  async login (connection: XConn) {
    // if (this.connection?.Socket.session) { return } // Already logged in
    await connection.Socket.open()
    await connection.Socket.login()
  }

  async trade (eindex: number, signal: TelegramSignal) {
    const connection = this.connections[eindex] as XConn
    if (!connection) {
      getLogger('tserver').error(
        'Closed connection', connection, 'at index', eindex, 'for signal', signal)
      return
    }

    await this.login(connection)
    await delay(1000) // Grease the wheels

    const socket = connection.Socket
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

  close () {
    if (this.connected) {
      getLogger().warning('Closing Telegram server')
    }
    this.#ctl.abort()
    this.connected = false
  }

}
