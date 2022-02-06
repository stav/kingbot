import type { XapiConfigAccount } from '../../config.d.ts'
import type XapiSocket from '../socket/socket.ts'
import { XSocket } from '../xsocket.ts'

type InputData = {
  command: string
  arguments?: { openedOnly: boolean }
}

export default class XapiStream extends XSocket {

  Socket: XapiSocket

  constructor (account: XapiConfigAccount, socket: XapiSocket) {
    super(account)
    this.Socket = socket
  }

  get url (): string {
    return 'wss://ws.xtb.com/' + this.account.type + 'Stream'
  }

  get session (): string {
    return this.Socket.session
  }

  async #listener (message: MessageEvent) {
    const m = JSON.parse(message.data)
    if (m.command === 'trade') {
      console.log('got MESSAGE3!', m.data)
      // print familys, trades
      await this.Socket.check(m.data)
      // print all trades
    }
  }

  ping () {
    if (this.isOpen)
      this.send({ command: 'ping' })
  }

  listen () {
    this.socket?.addEventListener('message', this.#listener.bind(this))
    this.send({ command: 'getTrades', arguments: { openedOnly: true }})
  }

  unlisten () {
    this.socket?.removeEventListener('message', this.#listener)
    this.send({ command: 'stopTrades' })
  }

  // Note: sending before login will close the connection
  send (data: InputData) {
    if (this.isOpen) {
      const streamSessionId = this.session
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
