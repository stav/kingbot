import { serve } from 'std/http/server.ts'
import { getLogger } from 'std/log/mod.ts'

import type { TelegramChatMap } from 'lib/config.d.ts'
import { Telegram } from 'lib/config.ts'
import Logging from 'lib/logging.ts'

import type { KingConn } from '../conn.d.ts'
import { Trader } from '../trader.ts'

import type { TelethonMessage } from './parsers/parsers.d.ts'
import { parse } from './parsers/mod.ts'

/**
 * HTTP server listening for signals from Telethon client
 */
export default class Server {

  #ctl = new AbortController()

  #chatMap: TelegramChatMap = {}

  private connections: KingConn[] = []

  public connected = false

  public trader: Trader | null = null

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
    const agent = request.headers.get('user-agent')
    const logger = getLogger('tserver')
    const payload = await request.json() as TelethonMessage
    logger.info('Received payload from', agent, payload)
    try {
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

      // deno-lint-ignore no-explicit-any
      let trades: any[][] = []
      if (this.trader) {
        trades = await this.trader.signalTrades(payload.eindexes, signal)
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

  connect (trader: Trader, port = 8000) {
    this.#chatMap = Telegram().ChatMap
    this.trader = trader
    serve( this.handler.bind(this), { port, signal: this.#ctl.signal } )
    this.connected = true
    // const url = 'http://localhost:8000'
    return `I am aware of ${trader.conns.length - 1} exchange connections`
  }

  close () {
    if (this.connected) {
      getLogger().warning('Closing Telegram server')
    }
    this.#ctl.abort()
    this.connected = false
  }

}
