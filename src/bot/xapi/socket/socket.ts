import type { XapiConfigAccount, XapiAccount } from '../../../lib/config.d.ts'

import { XSocket } from '../xsocket.ts'

import type { XapiResponse, XapiLoginResponse } from './socket.d.ts'
import { trade, trades } from './trade.ts'
import { send, sync } from './send.ts'
import { check } from './profits.ts'
import hedge from './hedge.ts'
import story from './story.ts'

export default class XapiSocket extends XSocket {

  #account: XapiAccount
  session = ''

  trades = trades
  check = check
  hedge = hedge
  story = story
  trade = trade
  send = send
  sync = sync

  get url (): string {
    return 'wss://ws.xtb.com/' + this.account.type
  }

  constructor (account: XapiConfigAccount) {
    super(account)
    this.#account = Object.assign({ pw: account.password }, this.account)
  }

  ping (): void {
    this.send({ command: 'ping' })
  }

  prompt () {
    return this.xprompt(!!this.session)
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
