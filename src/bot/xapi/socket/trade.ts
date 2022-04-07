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

export async function makeTrade(this: XapiSocket, trade: TRADE_TRANS_INFO, customTag = ''): TradeResponse {
  // First make the trade
  let data: InputData = {
    command: 'tradeTransaction',
    arguments: { tradeTransInfo: trade },
    customTag
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

/** getTradeCommand
 *
 * If the trade command is exactly "BUY" or "SELL" then use the current market
 * price to determine if should be a LIMIT or STOP order. Otherwise just return
 * the original trade command.
 *
 * @param trade The trade in question
 * @param quote The current market price quotation for the asset on the trade
 * @returns number - The trade "command", for example: "BUY_LIMIT"
 */
function getTradeCommand(trade: TRADE_TRANS_INFO, quote: TICK_RECORD) {
  if (trade.cmd === CMD_FIELD.BUY) {
    return quote.ask > trade.price ? CMD_FIELD.BUY_STOP : CMD_FIELD.BUY_LIMIT
  }
  if (trade.cmd === CMD_FIELD.SELL) {
    return quote.bid > trade.price ? CMD_FIELD.SELL_STOP : CMD_FIELD.SELL_LIMIT
  }
  return trade.cmd
}

/** makeTrades
 *
 * Creates orders.
 *
 * Note: The type of order designated by the `cmd` field may be changed based on
 * market price.
 * @see getTradeCommand
 *
 * @param trades The list of trades we want to create
 * @returns array - A list of the results from the order creation requests
 */
export async function makeTrades (this: XapiSocket, trades: TRADE_TRANS_INFO[]) {
  const tlogger = getLogger('traders')
  const results = [] as STREAMING_TRADE_STATUS_RECORD[]

  const symbols = trades.map(trade => trade.symbol)
  const quotes = await this.getPriceQuotes(symbols)
  getLogger().info('ServerTradeQuotes', quotes)

  // for (const trade of trades) {
  for (let i=0; i<trades.length; i++) {
    const trade = trades[i]
    const customTag = `Order ${i+1} of ${trades.length}`
    const quote = quotes.filter(quote => quote.symbol === trade.symbol)[0]
    trade.cmd = getTradeCommand(trade, quote) // cmd updated based on price
    const result = await makeTrade.bind(this)(trade, customTag) as STREAMING_TRADE_STATUS_RECORD
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
