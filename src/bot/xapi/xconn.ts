import type { XapiConfigAccount } from '../config.d.ts'
import type { KingConn } from '../conn.d.ts'
import { inspect } from '../lib/inspect.ts'

import XapiSocket from './socket/socket.ts'
import XapiStream from './stream/stream.ts'

export default class XConn implements KingConn {

  Socket: XapiSocket
  Stream: XapiStream

  inspect: () => void = inspect

  constructor (account: XapiConfigAccount) {
    this.Socket = new XapiSocket(account)
    this.Stream = new XapiStream(account, this.Socket)
  }

  connect () {
    this.Socket.connect()
    this.Stream.connect()
  }

  ping () {
    this.Socket.ping()
    this.Stream.ping()
  }

  login () {
    this.Socket.login()
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

  print () {
    this.Socket.print()
    this.Stream.print()
  }

  list (index: number) {
    console.log('CNX', index, this.Socket.info, this.Stream.info)
  }

}
