import { getLogger } from 'std/log/mod.ts'

import Logging from 'lib/logging.ts'

import { CMD_FIELD, REQUEST_STATUS_FIELD } from '../xapi.ts'
import type {
  TICK_RECORD,
  TRADE_RECORD,
  TRADE_TRANS_INFO,
  STREAMING_TRADE_STATUS_RECORD,
} from '../xapi.d.ts'

import type XapiSocket from './socket.ts'
import type {
  InputData,
  XapiResponse,
  XapiDataResponse,
  ErrorResponse,
} from './socket.d.ts'

type TradeStatus = STREAMING_TRADE_STATUS_RECORD | void
type TradeResponse = Promise<TradeStatus | ErrorResponse>

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

export async function makeTrade(this: XapiSocket, trade: TRADE_TRANS_INFO): TradeResponse {
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
    return response as ErrorResponse
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

function getTradeCommand(trade: TRADE_TRANS_INFO, quote: TICK_RECORD) {
  let cmd: 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT' | 'BUY_STOP' | 'SELL_STOP' | 'BALANCE' | 'CREDIT'
  if (isBuyOrder(trade.cmd)) {
    cmd = quote.ask > trade.price ? 'BUY_STOP' : 'BUY_LIMIT'
  }
  else {
    cmd = quote.bid > trade.price ? 'SELL_STOP' : 'SELL_LIMIT'
  }
  return CMD_FIELD[cmd]
}

export async function makeTrades (this: XapiSocket, trades: TRADE_TRANS_INFO[]) {
  const tlogger = getLogger('traders')
  const results = [] as STREAMING_TRADE_STATUS_RECORD[]

  const symbols = trades.map(trade => trade.symbol)
  const quotes = await this.getPriceQuotes(symbols)
  getLogger().info('ServerTradeQuotes', quotes)

  for (const trade of trades) {
    const quote = quotes.filter(quote => quote.symbol === trade.symbol)[0]
    trade.cmd = getTradeCommand(trade, quote) // cmd updated based on price
    const result = await makeTrade.bind(this)(trade) as STREAMING_TRADE_STATUS_RECORD
    results.push(result)

    tlogger.info('ServerTradeResult', trade, result)
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
