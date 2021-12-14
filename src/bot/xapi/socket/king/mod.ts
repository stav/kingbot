import Logger from '../../../../log.ts'

import { CMD_FIELD, TYPE_FIELD } from '../../xapi.ts'
import { TRADE_RECORD, TRADE_TRANS_INFO } from '../../xapi.d.ts'

import { State } from '../const.ts'
import Socket from '../mod.ts' // XXX TODO Circular reference

import { InputData, KingResponse, XapiDataResponse } from './mod.d.ts'
import { sendx, sync } from './send.ts'
import status from './status.ts'
import print from './print.ts'

export default class KingSocket extends WebSocket {

  session = ''
  status = status
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

  async trades (): Promise<void> {
    const data: InputData = {
      command: 'getTrades',
      arguments: {
        openedOnly: false,
      }
    }
    const response: KingResponse = await this.sync(data)
    if (response.status) {
      const trades: TRADE_RECORD[] = (<XapiDataResponse>response).returnData
      trades.sort((a: TRADE_RECORD, b: TRADE_RECORD) => a.open_time - b.open_time)
      console.info('trades', trades)
    }
    else {
      console.error('Trades', response)
    }
  }

  async trade() {
    // First make the trade
    const trade: TRADE_TRANS_INFO = {
      order: 0,
      offset: 0,
      symbol: 'GOLD',
      cmd: CMD_FIELD.SELL_STOP,
      price: 1772,
      sl: 1780,
      tp: 1769,
      type: TYPE_FIELD.OPEN,
      volume: 0.01,
      expiration: new Date().getTime() + 60000 * 60 * 24 * 365,
      customComment: 'K1NGbot ' + Date.now(),
    }
    let data: InputData = {
      command: 'tradeTransaction',
      arguments: {
        tradeTransInfo: trade,
      }
    }
    let response: KingResponse = await this.sync(data)
    let returnData = (<XapiDataResponse>response).returnData
    console.log(returnData)

    // Then check the trade status
    data = {
      command: 'tradeTransactionStatus',
      arguments: {
        order: returnData.order,
      }
    }
    response = await this.sync(data)
    returnData = (<XapiDataResponse>response).returnData
    console.log(returnData)
  }

}
