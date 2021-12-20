import Logger from '../../log.ts'
import print from './print.ts'

enum State {
  CONNECTING = 0,
  OPEN       = 1,
  CLOSING    = 2,
  CLOSED     = 3,
}

export class KingCat {

  socket: WebSocket | null = null
  session = ''
  account
  print = print

  // deno-lint-ignore no-explicit-any
  constructor (account: any) {
    this.account = account
  }

  private _isOpen (): boolean {
    return this.socket?.readyState === State.OPEN
  }

  protected gotClose (event: CloseEvent): void {
    this.session = ''
    Logger.info('Socket closed with code', event.code)
    // TODO Reenable reconnect
    // if (event.code !== 1000) {
    //   Logger.info('Restarting')
    //   setTimeout(Socket.connect, 1000)
    // }
  }

  protected gotError (e: Event | ErrorEvent): void {
    Logger.error((<ErrorEvent>e).message)
    this.print()
  }

  protected gotMessage (message: MessageEvent): void {
    Logger.info(message.data)
  }

  protected state (): string | undefined {
    if (this.socket)
      return State[this.socket.readyState]
  }

  get isOpen (): boolean {
    return this._isOpen()
  }

  get url (): string {
    // wss://ws.xtb.com/demo
    // wss://ws.xtb.com/demoStream
    // wss://ws.xtb.com/real
    // wss://ws.xtb.com/realStream
    return 'wss://ws.xtb.com/' + this.account.type
  }

  connect (): void {
    if (!this.socket || !this.isOpen) {
      this.socket = new WebSocket(this.url)
      this.socket.onopen = this.print.bind(<KingCat>this)
      this.socket.onclose = this.gotClose.bind(this)
      this.socket.onerror = this.gotError.bind(this)
      this.socket.onmessage = this.gotMessage
    }
  }

}

export enum CMD_FIELD {
  BUY = 0,
  SELL = 1,
  BUY_LIMIT = 2,
  SELL_LIMIT = 3,
  BUY_STOP = 4,
  SELL_STOP = 5,
  BALANCE = 6,
  CREDIT = 7,
}

export enum TYPE_FIELD {
  OPEN = 0,
  PENDING = 1,
  CLOSE = 2,
  MODIFY = 3,
  DELETE = 4,
}
