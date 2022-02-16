import { delay } from 'std/async/mod.ts'

import type { XapiConfigAccount } from 'lib/config.d.ts'
import { inspect } from 'lib/inspect.ts'

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

  constructor (account: XapiConfigAccount) {
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

  login () {
    this.Socket.login()
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

  story () {
    this.Socket.story()
  }

  async trades () {
    const trades = await this.Socket.trades()
    return [ trades, trades.length ]
  }

  trade () {
    this.Socket.trade()
  }

  async hedge () {
    return await this.Socket.hedge()
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

  list (index: number) {
    return `CNX ${index || ''} [${this.prompt()}] ${this.constructor.name} ${this.Socket.info} ${this.Stream.info}`
  }

}
