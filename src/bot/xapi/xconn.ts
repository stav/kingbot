import { delay } from 'std/async/mod.ts'

import type { XapiExchangeAccount } from 'lib/config.d.ts'
import { inspect } from 'lib/inspect.ts'
import { input } from 'lib/config.ts'

import type { KingConn } from '../conn.d.ts'

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

  async start () {
    await this.Stream.open()
    await this.Socket.open()
    await this.Socket.login()
    this.alive()
    return this.status()
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
    await this.Socket.open()
    this.Socket.login() // Floating promise
  }

  ping () {
    this.Socket.ping()
    this.Stream.ping()
  }

  listen () {
    this.Stream.listen()
  }

  unlisten () {
    this.Stream.unlisten()
  }

  async balance () {
    await this.Socket.open()
    await this.Socket.login()
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
    return await this.Socket.getPriceHistory(input().Xapi.Bars)
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
