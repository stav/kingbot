import { KingCat } from '../xapi.ts'

type InputData = {
  command: string
  // streamSessionId: string
}

export default class KingStream extends KingCat {

  // deno-lint-ignore no-explicit-any
  constructor (account: any) {
    super(account)
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
