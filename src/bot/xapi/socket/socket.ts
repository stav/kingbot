import Logger from '../../../log.ts'

import { KingCat } from '../xapi.ts'
import print from '../print.ts'

import { KingResponse, XapiLoginResponse } from './socket.d.ts'
import { trade, trades } from './trade.ts'
import { sendx, sync } from './send.ts'
import story from './story.ts'

export default class KingSocket extends KingCat {

  trades = trades
  trade = trade
  print = print
  story = story
  sendx = sendx
  sync = sync

  // deno-lint-ignore no-explicit-any
  constructor (account: any) {
    super(account)
  }

  private _gotClose (event: CloseEvent): void {
    this.session = ''
    Logger.info('Socket closed with code', event.code)
    // TODO Reenable reconnect
    // if (event.code !== 1000) {
    //   Logger.info('Restarting')
    //   setTimeout(Socket.connect, 1000)
    // }
  }

  private _gotError (e: Event | ErrorEvent): void {
    Logger.error((<ErrorEvent>e).message)
    this.print()
  }

  private _gotMessage (message: MessageEvent): void {
    Logger.info(message.data)
  }

  connect (): void {
    if (!this.socket || !this.isOpen) {
      this.socket = new WebSocket(this.url)
      this.socket.onopen = this.print.bind(this)
      this.socket.onclose = this._gotClose.bind(this)
      this.socket.onerror = this._gotError.bind(this)
      this.socket.onmessage = this._gotMessage
    }
  }

  ping (): void {
    this.sendx({ command: 'ping' })
  }

  async login (): Promise<void> {
    const data = {
      command: 'login',
      arguments: {
        userId: this.account.accountId,
        password: this.account.password,
        appName: 'KingBot',
      }
    }
    const response: KingResponse = await this.sync(data)
    if (response.status) {
      this.session = (<XapiLoginResponse>response).streamSessionId
    }
  }

  logout (): void {
    this.session = ''
    this.sendx({ command: 'logout' }) // Server will close the connection
    this.close()
    this.print()
  }

  close (): void {
    if (this.socket) {
      // Close 1000 so the bot does not try and restart
      this.isOpen && this.socket.close(1000)
      this.print()
    }
  }

}
