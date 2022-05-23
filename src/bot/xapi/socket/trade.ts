import { getLogger } from 'std/log/mod.ts'

import Logging from 'lib/logging.ts'

import type {
  TRADE_RECORD,
  TRADE_TRANS_INFO,
  STREAMING_TRADE_STATUS_RECORD,
  TradeTransInfoPosition,
} from '../xapi.d.ts'
import { CMD_FIELD, REQUEST_STATUS_FIELD } from '../xapi.ts'
import { tradeTransInfoFields } from '../record.ts'

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
  const statusReturnData = (<XapiDataResponse>response).returnData as TradeResponse

  getLogger().info('Trade', { data: tradeReturnData, status: statusReturnData })
  Logging.flush()

  return statusReturnData
}

/** makeTrades
 *
 * Creates orders.
 *
 * @param trades The list of trades we want to create
 * @returns array - A list of the results from the order creation requests
 */
export async function makeTrades (this: XapiSocket, trades: TRADE_TRANS_INFO[]) {
  const tlogger = getLogger('traders')
  const results = [] as STREAMING_TRADE_STATUS_RECORD[]

  // for (const trade of trades) {
  for (let i=0; i<trades.length; i++) {
    const trade = trades[i]
    const customTag = `Order ${i+1} of ${trades.length}`
    const result = await makeTrade.bind(this)(trade, customTag) as STREAMING_TRADE_STATUS_RECORD
    results.push(result)

    tlogger.info('ServerTradeResult1', { trade, result })
    tlogger.info(
      'ServerTradeResult2',
      trade.customComment,
      trade.symbol,
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

type IndexableTradeRecord = TRADE_RECORD & { [index: string]: string | number }

export async function update (this:XapiSocket, data: TradeTransInfoPosition) {
  const trades: TRADE_RECORD[] = await this.getOpenTrades()
  console.log(`update: ${trades.length} open trades in total`)

  const positions = trades.filter(t => t.position === data.position)
  console.log(`update: ${positions.length} position(s) for ${data.position}`)

  const pos = positions[0] as IndexableTradeRecord
  const price = pos.open_price
  for (const key in pos) {
    if (!tradeTransInfoFields.includes(key))
      delete pos[key]
  }
  const transaction = Object.assign({ price }, pos, data)
  return await this.makeTrade(transaction)
}
