import { delay } from 'std/async/mod.ts'

import type { XapiExchangeAccount } from 'lib/config.d.ts'
import { inspect } from 'lib/inspect.ts'
import { input } from 'lib/config.ts'

import type { KingConn } from '../conn.d.ts'

import type { TradeTransInfoPosition } from './xapi.d.ts'
import XapiSocket from './socket/socket.ts'
import XapiStream from './stream/stream.ts'

/**
 * "At most 50 simultaneous connections from the same client address are allowed"
 * @see http://developers.xstore.pro/documentation/#connection-validation
 */
export default class XConn implements KingConn {

  Socket: XapiSocket
  Stream: XapiStream

  inspect: () => void = inspect

  constructor (account: XapiExchangeAccount) {
    this.Socket = new XapiSocket(account)
    this.Stream = new XapiStream(account, this.Socket)
  }

  private async alive () {
    this.Stream.send({ command: 'getKeepAlive' })
    while (this.Stream.isOpen) {
      this.ping()
      await delay(9000)
    }
  }

  prompt () {
    return (this.Socket.prompt()) +
           (this.Stream.prompt())
  }

  list (index: number) {
    return `CNX ${index || ''} [${this.prompt()}] ${this.constructor.name} ${this.Socket.info} ${this.Stream.info}`
  }

  connect () {
    this.Socket.connect()
    this.Stream.connect()
  }

  /**
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-floating-promises.md
   * @see https://palantir.github.io/tslint/rules/no-floating-promises
   */
  async login () {
    if (!this.Socket.isOpen) {
      await this.Socket.open()
      await this.Socket.login()
    }
  }

  async start () {
    await this.login()
    await this.Stream.open()
    this.Stream.listen()
    this.alive()
    return this.status()
  }

  ping () {
    this.Socket.ping()
    this.Stream.ping()
  }

  unlisten () {
    this.Stream.unlisten()
  }

  async balance () {
    await this.login()
    const story = await this.story()
    return story.getMarginLevel.balance
  }

  async story () {
    return await this.Socket.story()
  }

  async trades () {
    return await this.Socket.getOpenTrades()
  }

  async hedge () {
    return await this.Socket.hedge()
  }

  async quote () {
    return await this.Socket.getPriceQuotes(input().Price)
  }

  async price () {
    return await this.Socket.getPriceHistory(input().Xapi.BarsParams).catch(console.error)
  }

  async p () {
    await this.login()
    return await this.Socket.candles(input().Xapi.BarsParams)
  }

  async update () {
    await this.login()
    return await this.Socket.update(input().Update as unknown as TradeTransInfoPosition)
  }

  logout () {
    this.Socket.logout()
  }

  close () {
    this.Stream.close()
    this.Socket.close()
  }

  status () {
    return [
      this.Socket.status,
      this.Stream.status,
    ]
  }

}
