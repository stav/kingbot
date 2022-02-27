import { getLogger } from 'std/log/mod.ts'

import type { XapiConfigAccount, XapiAccount } from 'lib/config.d.ts'
import Logging from 'lib/logging.ts'

import { XSocket } from '../xsocket.ts'

import type { InputData, XapiResponse, XapiDataResponse, XapiLoginResponse } from './socket.d.ts'
import { trade, trades } from './trade.ts'
import { send, sync } from './send.ts'
import { check } from './profits.ts'
import hedge from './hedge.ts'

export default class XapiSocket extends XSocket {

  #account: XapiAccount
  session = ''

  trades = trades
  check = check
  hedge = hedge
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

  protected async fetchCommand (command: string) {
    const data: InputData = { command }
    const response: XapiResponse = await this.sync(data)
    return (<XapiDataResponse>response).returnData
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
    else if (response.errorCode === 'BE118') // Already logged in
      getLogger().info('Login:', response.errorDescr)
    else
      console.error('Login error', response, data) // TODO: Will expose password
  }

  async story () {
    return {
      getCurrentUserData: await this.fetchCommand('getCurrentUserData'),
      getMarginLevel:     await this.fetchCommand('getMarginLevel'),
      getVersion:         await this.fetchCommand('getVersion'),
      getServerTime:      await this.fetchCommand('getServerTime'),
    }
  }

  logout (): void {
    this.session = ''
    this.send({ command: 'logout' }) // Server will close the connection
    this.close()
    getLogger().info(this.status)
    Logging.flush()
  }

  close (): void {
    if (this.socket) {
      // Close 1000 so the bot does not try and restart
      this.isOpen && this.socket.close(1000)
      getLogger().info(this.status)
      Logging.flush()
    }
  }

}
