import Logger from '../../log.ts'

enum State {
  CONNECTING = 0,
  OPEN       = 1,
  CLOSING    = 2,
  CLOSED     = 3,
}

export abstract class XSocket {

  // deno-lint-ignore no-explicit-any
  [index: string]: any // allow parent property access (session)

  socket: WebSocket | null = null
  account

  // deno-lint-ignore no-explicit-any
  constructor (account: any) {
    this.account = account
  }

  private get _isOpen (): boolean {
    return this.socket?.readyState === State.OPEN
  }

  private get _state (): string | undefined {
    return this.socket ? State[this.socket.readyState] : undefined
  }

  protected gotClose (event: CloseEvent): void {
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

  get isOpen (): boolean {
    return this._isOpen
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
      this.socket.onopen = this.print.bind(<XSocket>this)
      this.socket.onclose = this.gotClose.bind(this)
      this.socket.onerror = this.gotError.bind(this)
      this.socket.onmessage = this.gotMessage
    }
  }

  print () {
    const id = this.account.accountId
    const ses = this['session']
    const url = this.socket?.url
    const stat = this._state
    const name = this.constructor.name
    console.info(`${name}  ${url}  ${id}  ${stat}  ${ses}`)
  }

}
