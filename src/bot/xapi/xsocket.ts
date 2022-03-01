import { delay } from 'std/async/mod.ts'
import { getLogger } from 'std/log/mod.ts'

import type { XapiConfigAccount, XapiAccount } from 'lib/config.d.ts'
import { human } from 'lib/time.ts'
import Logging from 'lib/logging.ts'

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

  private get time () {
    if (!this.date?.opened) { return '' }
    const open = this.date.opened
    const close = this.date?.closed || Date.now()
    return human({ s: (close - open) / 1000 })
  }

  protected gotOpen (event: Event) {
    const target = event.target as EventTarget & { url: string}
    getLogger('message').info('Socket opened', target?.url)
    Logging.flush()
    this.date.opened = event.timeStamp
    this.date.closed = 0
    this.print()
  }

  protected gotClose (event: CloseEvent): void {
    getLogger('message').info('Socket closed with code', event.code)
    Logging.flush()
    this.date.closed = Date.now()
    // TODO Reenable reconnect
    // if (event.code !== 1000) {
    //   console.info('Restarting')
    //   setTimeout(Socket.connect, 1000)
    // }
  }

  protected gotError (e: Event | ErrorEvent): void {
    const message = (<ErrorEvent>e).message
    getLogger('message').error(message)
    console.error(message)
    Logging.flush()
    this.print()
  }

  protected gotMessage (message: MessageEvent): void {
    getLogger('message').info(message.data)
    Logging.flush()
  }

  get info () {
    const tAcct = this.account
    const tName = this.constructor.name
    return `${tName}(${tAcct.id}|${tAcct.name})`
  }

  get status () {
    const id = this.account.id
    const ses = this.session
    const url = this.socket?.url
    const obj = this.constructor.name
    const name = this.account.name
    const stat = this.state
    const time = this.time
    return `${obj}  ${url}  ${id}|${name}  ${stat}|${time}  ${ses}`.trim()
  }

  print () {
    console.info(this.status)
  }

  xprompt (active: boolean) {
    return this.isOpen && active
      ? 'l'
      : this.isOpen
        ? 'o'
        : '-'
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

  async open (): Promise<void> {
    if (this.isOpen) return;

    let timeout = 0
    let result = false

    const gotOpen = (_event: Event) => {
      this.date.opened = Date.now()
      this.date.closed = 0
      this.print()
      result = true
    }

    this.socket = new WebSocket(this.url)
    this.socket.onopen = gotOpen.bind(this)
    this.socket.onclose = this.gotClose.bind(this)
    this.socket.onerror = this.gotError.bind(this)
    this.socket.onmessage = this.gotMessage

    while (!result) {
      if (++timeout > 10) {
        console.error({ status: false, errorCode: 'K1NG', errorDescr: 'Timeout' })
      }
      else {
        console.log('wait')
        await delay(200)
      }
    }
  }

}
