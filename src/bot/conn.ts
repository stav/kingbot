import type { ConfigAccount } from './config.d.ts'

import KingSocket from './xapi/socket/socket.ts'
import KingStream from './xapi/stream/stream.ts'

export default class KingConn {

  Socket: KingSocket
  Stream: KingStream

  static dummy () {
    return new KingConn({} as ConfigAccount)
  }

  constructor (account: ConfigAccount) {
    this.Socket = new KingSocket(account)
    this.Stream = new KingStream(account, this.Socket)
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
