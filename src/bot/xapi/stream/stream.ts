import KingSocket from '../socket/socket.ts'
import { KingCat } from '../xapi.ts'

type InputData = {
  command: string
  // streamSessionId: string
}

export default class KingStream extends KingCat {

  Socket: KingSocket

  // deno-lint-ignore no-explicit-any
  constructor (account: any, kingsocket: KingSocket) {
    super(account)
    this.Socket = kingsocket
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
