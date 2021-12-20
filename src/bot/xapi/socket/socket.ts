import { XSocket } from '../xsocket.ts'

import { KingResponse, XapiLoginResponse } from './socket.d.ts'
import { trade, trades } from './trade.ts'
import { send, sync } from './send.ts'
import story from './story.ts'

export default class KingSocket extends XSocket {

  trades = trades
  trade = trade
  story = story
  send = send
  sync = sync

  session = ''

  // deno-lint-ignore no-explicit-any
  constructor (account: any) {
    super(account)
  }

  ping (): void {
    this.send({ command: 'ping' })
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
