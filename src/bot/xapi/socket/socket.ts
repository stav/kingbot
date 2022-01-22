import type { XapiConfigAccount, XapiAccount } from '../../config.d.ts'

import { XSocket } from '../xsocket.ts'

import type { XapiResponse, XapiLoginResponse } from './socket.d.ts'
import { trade, trades } from './trade.ts'
import { send, sync } from './send.ts'
import story from './story.ts'

export default class XapiSocket extends XSocket {

  #account: XapiAccount
  session = ''

  trades = trades
  trade = trade
  story = story
  send = send
  sync = sync

  constructor (account: XapiConfigAccount) {
    super(account)
    this.#account = Object.assign({ pw: account.password }, this.account)
  }

  get url (): string {
    return 'wss://ws.xtb.com/' + this.account.type
  }

  ping (): void {
    this.send({ command: 'ping' })
  }

  async login (): Promise<void> {
    const data = {
      command: 'login',
      arguments: {
        userId: this.#account.id,
        password: this.#account.pw,
        appName: 'KingBot',
      }
    }
    const response: XapiResponse = await this.sync(data)
    if (response.status)
      this.session = (<XapiLoginResponse>response).streamSessionId
    else
      console.error('Login error', response)
  }

  logout (): void {
    this.session = ''
    this.send({ command: 'logout' }) // Server will close the connection
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
