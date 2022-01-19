import Logger from '../../log.ts'

import type { XapiConfigAccount, XapiAccount } from '../config.d.ts'
import Socket from '../socket.ts'

export abstract class XSocket extends Socket {

  // deno-lint-ignore no-explicit-any
  [index: string]: any // allow parent property access (session)

  date: { [index: string]: number } = {}
  account: XapiAccount

  constructor (account: XapiConfigAccount) {
    super()
    this.account = {
      id:   account.accountId,
      // pw:account.password,
      name: account.name,
      type: account.type,
    }
  }

  protected gotOpen (_event: Event) {
    this.date.opened = Date.now()
    this.date.closed = 0
    this.print()
  }

  protected gotClose (event: CloseEvent): void {
    Logger.info('Socket closed with code', event.code)
    this.date.closed = Date.now()
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

  get url (): string {
    // wss://ws.xtb.com/demo
    // wss://ws.xtb.com/demoStream
    // wss://ws.xtb.com/real
    // wss://ws.xtb.com/realStream
    return 'wss://ws.xtb.com/' + this.account.type
  }

  get info () {
    const tAcct = this.account
    const tName = this.constructor.name
    return `${tName}(${tAcct.id}|${tAcct.name})`
  }

  connect (): void {
    if (!this.socket || !this.isOpen) {
      this.socket = new WebSocket(this.url)
      this.socket.onopen = this.gotOpen.bind(this)
      this.socket.onclose = this.gotClose.bind(this)
      this.socket.onerror = this.gotError.bind(this)
      this.socket.onmessage = this.gotMessage
    }
  }

  private get time () {
    if (!this.date?.opened) {
      return ''
    }
    function human (o: { h: number, m: number, s: number }) {
      while (o.s > 60) { o.m++; o.s -= 60 }
      while (o.m > 60) { o.h++; o.m -= 60 }
      return `${Math.floor(o.h)}h${Math.floor(o.m)}m${Math.floor(o.s)}s`
    }
    const open = this.date.opened
    const close = this.date?.closed || Date.now()
    const s = (close - open) / 1000

    return human({ h: 0, m: 0, s })
  }

  print () {
    const id = this.account.id
    const ses = this.session
    const url = this.socket?.url
    const obj = this.constructor.name
    const name = this.account.name
    const stat = this.state
    const time = this.time
    console.info(`${obj}  ${url}  ${id}|${name}  ${stat}|${time}  ${ses}`)
  }

}