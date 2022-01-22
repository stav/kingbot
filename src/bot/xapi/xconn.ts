import { delay } from 'https://deno.land/std/async/mod.ts'

import type { XapiConfigAccount } from '../config.d.ts'
import type { KingConn } from '../conn.d.ts'
import { inspect } from '../lib/inspect.ts'

import XapiSocket from './socket/socket.ts'
import XapiStream from './stream/stream.ts'

export default class XConn implements KingConn {

  Socket: XapiSocket
  Stream: XapiStream

  inspect: () => void = inspect

  private async alive () {
    this.Stream.send({ command: 'getKeepAlive' })
    while (this.Stream.isOpen) {
      this.ping()
      await delay(9000)
    }
  }

  constructor (account: XapiConfigAccount) {
    this.Socket = new XapiSocket(account)
    this.Stream = new XapiStream(account, this.Socket)
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

  trades () {
    this.Socket.trades()
  }

  trade () {
    this.Socket.trade()
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
    return `CNX ${index || ''} ${this.constructor.name} ${this.Socket.info} ${this.Stream.info}`
  }

}
