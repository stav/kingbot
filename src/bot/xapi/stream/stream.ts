import type { XapiConfigAccount } from 'lib/config.d.ts'

import { XSocket } from '../xsocket.ts'

import type XapiSocket from '../socket/socket.ts'

// deno-lint-ignore no-explicit-any
type Symbolic = { [index: symbol]: any }
type SymbolSocket = WebSocket & Symbolic
type InputData = {
  command: string
  arguments?: { openedOnly: boolean }
}

export default class XapiStream extends XSocket {

  Socket: XapiSocket

  constructor (account: XapiConfigAccount, xsocket: XapiSocket) {
    super(account)
    this.Socket = xsocket
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
      console.log('got MESSAGE', m.data)
      // print familys, trades
      await this.Socket.check(m.data)
      // print all trades
    }
  }

  ping () {
    if (this.isOpen)
      this.send({ command: 'ping' })
  }

  prompt () {
    return this.xprompt(this.listening)
  }

  get listeners () {
    const socket = this.socket as SymbolSocket
    if (socket) {
      const symbols = Object.getOwnPropertySymbols(socket)
      const symbol = symbols.find(s => String(s) === 'Symbol()')
      if (symbol)
        return socket[symbol].listeners
    }
    return {}
  }

  get listener () {
    // deno-lint-ignore no-explicit-any
    const messagers: any[] = this.listeners.message
    return (messagers)
      ? messagers.find(m => m.callback.name.includes(this.#listener.name))
      : undefined
  }

  get listening () {
    return !!this.listener
  }

  listen () {
    this.socket?.addEventListener('message', this.#listener.bind(this))
    this.send({ command: 'getTrades', arguments: { openedOnly: true }})
  }

  unlisten () {
    const listener = this.listener?.callback
    if (listener) {
      this.socket?.removeEventListener('message', listener)
    }
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
      this.unlisten()
      this.isOpen && this.socket.close(1000)
      this.print()
    }
  }

}
