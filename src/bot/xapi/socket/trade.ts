import { CMD_FIELD, TYPE_FIELD } from '../xapi.ts'
import type { TRADE_RECORD, TRADE_TRANS_INFO } from '../xapi.d.ts'
import type { InputData, XapiResponse, XapiDataResponse } from './socket.d.ts'
import type XapiSocket from './socket.ts'

export async function trades (this: XapiSocket, openedOnly = false): Promise<TRADE_RECORD[]> {
  let trades: TRADE_RECORD[] = []
  const data: InputData = {
    command: 'getTrades',
    arguments: { openedOnly }
  }
  const response: XapiResponse = await this.sync(data)
  if (response.status) {
    trades = (<XapiDataResponse>response).returnData
    trades.sort((a: TRADE_RECORD, b: TRADE_RECORD) => a.open_time - b.open_time)
  }
  else {
    console.error('Trades', response)
  }
  return trades
}

export async function trade(this: XapiSocket): Promise<void> {
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
  let response: XapiResponse = await this.sync(data)
  if (!response.status)
    return console.error(response)

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
