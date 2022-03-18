import { getLogger } from 'std/log/mod.ts'

import Logging from 'lib/logging.ts'

import type { TRADE_RECORD, TRADE_TRANS_INFO, STREAMING_TRADE_STATUS_RECORD } from '../xapi.d.ts'
import type { InputData, XapiResponse, XapiDataResponse } from './socket.d.ts'
import type XapiSocket from './socket.ts'

type TradeStatus = STREAMING_TRADE_STATUS_RECORD | void

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
    getLogger().error('Trades', response)
    Logging.flush()
  }
  return trades
}

export async function trade(this: XapiSocket, trade: TRADE_TRANS_INFO): Promise<TradeStatus> {
  // First make the trade
  let data: InputData = {
    command: 'tradeTransaction',
    arguments: {
      tradeTransInfo: trade,
    }
  }
  let response: XapiResponse = await this.sync(data)
  if (!response.status) {
    getLogger().error(response)
    Logging.flush()
    return
  }
  const tradeReturnData = (<XapiDataResponse>response).returnData

  // Then check the trade status
  data = {
    command: 'tradeTransactionStatus',
    arguments: {
      order: tradeReturnData.order,
    }
  }
  response = await this.sync(data)
  const statusReturnData = (<XapiDataResponse>response).returnData

  getLogger().info('Trade', tradeReturnData, 'Status', statusReturnData)
  Logging.flush()

  return statusReturnData
}
