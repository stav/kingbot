import KingSocket from './xapi/socket/mod.ts'
import KingStream from './xapi/stream/mod.ts'

export default class KingConn {

  Socket: KingSocket
  Stream: KingStream

  constructor (account: any) {
    this.Socket = new KingSocket(account)
    this.Stream = new KingStream(account)
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

}
