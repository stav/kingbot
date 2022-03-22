import { getLogger } from 'std/log/mod.ts'

import Logging from 'lib/logging.ts'

import {CMD_FIELD, REQUEST_STATUS_FIELD } from '../xapi.ts'
import type { TICK_RECORD, TRADE_RECORD, TRADE_TRANS_INFO, STREAMING_TRADE_STATUS_RECORD } from '../xapi.d.ts'
import type { InputData, XapiResponse, XapiDataResponse } from './socket.d.ts'
import type XapiSocket from './socket.ts'

type TradeStatus = STREAMING_TRADE_STATUS_RECORD | void

async function getPriceQuotes(this: XapiSocket, trades: TRADE_TRANS_INFO[]) {
  const args = {
    level: 0,
    symbols: trades.map(trade => trade.symbol),
    timestamp: 0,
  }
  const result = await this.fetchCommand('getTickPrices', args)
  return result.quotations as TICK_RECORD[]
}

export async function getOpenTrades (this: XapiSocket, openedOnly = false): Promise<TRADE_RECORD[]> {
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
    getLogger().error('Trades: data', data, 'response', response)
    Logging.flush()
  }
  return trades
}

export async function makeTrade(this: XapiSocket, trade: TRADE_TRANS_INFO): Promise<TradeStatus> {
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

function isBuyOrder(cmd: number): boolean {
  return ['BUY', 'BUY_LIMIT', 'BUY_STOP'].includes(CMD_FIELD[cmd])
}

export async function makeTrades (this: XapiSocket, trades: TRADE_TRANS_INFO[]) {
  const klogger = getLogger()
  const tlogger = getLogger('tserver')
  const results = [] as STREAMING_TRADE_STATUS_RECORD[]

  const quotes = await getPriceQuotes.bind(this)(trades)
  const quote = quotes[0]
  klogger.info('ServerTradeQuotes', quotes)

  for (const trade of trades) {
    const result = await makeTrade.bind(this)(trade) as STREAMING_TRADE_STATUS_RECORD
    results.push(result)

    klogger.info('ServerTradeResult', trade, result)
    tlogger.info(
      trade.customComment,
      trade.symbol,
      isBuyOrder(trade.cmd) ? quote?.ask : quote?.bid,
      CMD_FIELD[trade.cmd],
      '@', trade.price,
      '=', trade.tp,
      'order', result.order,
      REQUEST_STATUS_FIELD[result.requestStatus as REQUEST_STATUS_FIELD],
      result.message ? result.message : '',
    )
  }
  Logging.flush()
  return results
}
