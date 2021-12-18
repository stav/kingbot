import Logger from '../../../log.ts'

import { KingCat } from '../xapi.ts'
import print from '../print.ts'

export default class KingStream extends KingCat {

  print = print

  // deno-lint-ignore no-explicit-any
  constructor (account: any) {
    super(account)
  }

  private _gotClose (event: CloseEvent) {
    Logger.info('Socket closed with code', event.code)
  }

  private _gotError (e: Event | ErrorEvent) {
    Logger.error((<ErrorEvent>e).message)
    this.print()
  }

  private _gotMessage (message: MessageEvent) {
    Logger.info(message.data)
  }

  connect () {
    if (!this.socket || !this.isOpen) {
      this.socket = new WebSocket(this.url)
      this.socket.onopen = this.print.bind(this)
      this.socket.onclose = this._gotClose
      this.socket.onerror = this._gotError.bind(this)
      this.socket.onmessage = this._gotMessage
    }
  }

  ping () {
    // this.sendx({ command: 'ping' })
  }

  close () {
    if (this.socket) {
      this.isOpen && this.socket.close(1000)
      this.print()
    }
  }

}
