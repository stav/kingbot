import Logger from '../../../log.ts'
import { CMD_FIELD, TYPE_FIELD } from '../xapi.ts'
import { TRADE_RECORD, TRADE_TRANS_INFO } from '../xapi.d.ts'
import { InputData, KingResponse, XapiDataResponse } from './king.d.ts'
import { State } from './const.ts'
import config from './config.ts'

export default class KingSocket extends WebSocket {

  session = ''

  constructor (url: string) {
    super(url)
    this.onopen = this.print
    this.onclose = this._gotClose
    this.onerror = this._gotError
    this.onmessage = this._gotMessage
  }

  private _state () {
    return State[this.readyState]
  }

  private _gotClose (_event: CloseEvent) {
    this.session = ''
  }

  private _gotError (e: Event | ErrorEvent) {
    Logger.error((<ErrorEvent>e).message)
    this.print()
  }

  private _gotMessage (message: MessageEvent) {
    Logger.info(message.data)
  }

  // version () {
  //   const response: KingResponse = await sync({ command: 'getVersion' }, socket)
  //   return response.status ? (<XapiDataResponse>response).returnData.version : ''
  // }

  get isOpen (): boolean {
    return this.readyState === State.OPEN
  }

  print () {
    const id = config.accountId
    const ses = this.session
    const url = this.url
    const stat = this._state()
    console.info(`Socket  ${url}  ${id}  ${stat}  ${ses}`)
  }

  sendx (data: InputData): void {
    if (this.isOpen) {
      this.send(JSON.stringify(data))
    }
  }

  async sync (data: InputData): Promise<KingResponse> {
    // TODO Also check for logged in
    if (!this.isOpen) { return { status: false, errorCode: 'K1NG', errorDescr: 'Closed' }}
    const customTag = Math.random().toString()
    const _data = Object.assign({ customTag }, data)
    let timeout = 0
    // deno-lint-ignore no-explicit-any
    let result: any

    Logger.info('Syncing', JSON.stringify(_data))

    function listener(message: MessageEvent) {
      const data = JSON.parse(message.data)
      if (data.customTag === customTag) {
        result = data
      }
    }
    this.addEventListener('message', listener, { once: true })
    this.sendx(_data)

    while (!result) {
      if (++timeout > 10) {
        result = { status: false, errorCode: 'K1NG', errorDescr: 'Timeout' }
      }
      else {
        console.log('wait')
        await new Promise(res => setTimeout(res, 200)) // Sleep
      }
    }

    return result
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
