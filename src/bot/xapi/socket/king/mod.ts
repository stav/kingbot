import Logger from '../../../../log.ts'

import Socket from '../mod.ts' // XXX TODO Circular reference

import { State } from './const.ts'
import { trade, trades } from './trade.ts'
import { sendx, sync } from './send.ts'
import status from './status.ts'
import print from './print.ts'

export default class KingSocket extends WebSocket {

  session = ''
  status = status
  trades = trades
  trade = trade
  print = print
  sendx = sendx
  sync = sync

  constructor (url: string) {
    super(url)
    this.onopen = this.print.bind(this)
    this.onclose = this._gotClose
    this.onerror = this._gotError
    this.onmessage = this._gotMessage
  }

  private _gotClose (event: CloseEvent) {
    this.session = ''
    Logger.info('Closed with code', event.code)
    if (event.code !== 1000) {
      Logger.info('Restarting')
      setTimeout(Socket.connect, 1000)
    }
  }

  private _gotError (e: Event | ErrorEvent) {
    Logger.error((<ErrorEvent>e).message)
    this.print()
  }

  private _gotMessage (message: MessageEvent) {
    Logger.info(message.data)
  }

  protected state () {
    return State[this.readyState]
  }

  get isOpen (): boolean {
    return this.readyState === State.OPEN
  }

}
