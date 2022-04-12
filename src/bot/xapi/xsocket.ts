import { delay, deadline, DeadlineError } from 'std/async/mod.ts'
import { getLogger } from 'std/log/mod.ts'

import type { XapiExchangeAccount, XapiAccount } from 'lib/config.d.ts'
import { human } from 'lib/time.ts'
import Logging from 'lib/logging.ts'

import Socket from '../socket.ts'

const MSG_FILTER = ['{"status":true}', '"keepAlive"']

export abstract class XSocket extends Socket {

  // deno-lint-ignore no-explicit-any
  [index: string]: any // allow parent property access (session)

  date: { [index: string]: number } = {}
  account: XapiAccount

  constructor (account: XapiExchangeAccount) {
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
    getLogger('message').info('Socket opened', target?.url, this.status)
    Logging.flush()
    this.date.opened = event.timeStamp
    this.date.closed = 0
  }

  protected gotClose (event: CloseEvent): void {
    getLogger('message').info('Socket closed with code', event.code, this.status)
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
    Logging.flush()
  }

  protected gotMessage (message: MessageEvent): void {
    const data = message.data as string
    getLogger('message').info(data)              // Log to message log
    if (!MSG_FILTER.some(s => data.includes(s))) // If filters not present
      getLogger().info('Message', data)          // Log to default
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

  xprompt (active: boolean) {
    return this.isOpen && active
      ? 'l'
      : this.isOpen
        ? 'o'
        : '-'
  }

  connect (gotOpen = this.gotOpen): void {
    if (!this.socket || !this.isOpen) {
      this.socket = new WebSocket(this.url)
      this.socket.onopen = gotOpen.bind(this)
      this.socket.onclose = this.gotClose.bind(this)
      this.socket.onerror = this.gotError.bind(this)
      this.socket.onmessage = this.gotMessage
    }
  }

  async open (): Promise<void> {
    if (this.isOpen) { return }

    const gotOpen = (event: Event) => {
      this.gotOpen(event)
      done = true
    }
    let done = false
    this.connect(gotOpen)
    async function wait () { while (!done) await delay(200) }
    try {
      await deadline(wait(), 2000)
    }
    catch (e) {
      if (e instanceof DeadlineError)
        getLogger().error({ status: false, errorCode: 'K1NG', errorDescr: 'XSocket Open Timeout' })
      else throw e
    }
  }

}
