import type { XapiConfigAccount } from '../../config.d.ts'
import type XapiSocket from '../socket/socket.ts'
import { XSocket } from '../xsocket.ts'

type InputData = {
  command: string
  // streamSessionId: string
}

export default class XapiStream extends XSocket {

  Socket: XapiSocket

  constructor (account: XapiConfigAccount, socket: XapiSocket) {
    super(account)
    this.Socket = socket
  }

  get session (): string {
    return this.Socket.session
  }

  ping () {
    this.send({ command: 'ping' })
  }

  send (data: InputData) {
    if (this.isOpen) {
      const streamSessionId = this.Socket.session
      const _data = Object.assign({ streamSessionId }, data)
      this.socket?.send(JSON.stringify(_data))
    }
  }

  close () {
    if (this.socket) {
      this.isOpen && this.socket.close(1000)
      this.print()
    }
  }

}
