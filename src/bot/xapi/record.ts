import { human } from 'lib/time.ts'

import type { STREAMING_TRADE_RECORD, TRADE_RECORD, TRADE_TRANS_INFO } from './xapi.d.ts'
import { CMD_FIELD, TYPE_FIELD } from './xapi.ts'

// deno-lint-ignore no-explicit-any
type IndexableRecord = STREAMING_TRADE_RECORD & { [index: string]: any }

export function translate (data: IndexableRecord) {
  if (data.open_time && data.close_time) {
    data.open_length = human({s: (data.close_time - data.open_time) / 1000})
  }
  if (data.open_time) {
    data.open_time_str = new Date(data.open_time)
  }
  if (data.close_time) {
    data.close_time_str = new Date(data.close_time)
  }
  data.cmd_field = CMD_FIELD[data.cmd]
  data.type_field = TYPE_FIELD[data.type]
  if (data.open_price && data.close_price) {
    data.price_diff = parseFloat(Math.abs(data.close_price - data.open_price).toFixed(data.digits))
  }
  return data
}

export const tradeTransInfoFields = [
  'cmd', 'offset', 'order', 'sl', 'symbol', 'tp', 'type', 'volume',
]

/**
 * assignTradeTransaction
 *
 * Remove all but certain fields from the given trade record and add in the
 * mystery price field.
 *
 * @todo Mystery field `price` is bound to some random value because it is needed
 * for a successful transaction and it is vaguely mentioned in the documentation.
 * @see http://developers.xstore.pro/documentation/#tradeTransaction
 *
 * @param trade Trade record we are mogrifying
 *
 * @returns The Mogrified trade record
 */
export function assignTradeTransaction (trade: TRADE_RECORD) {
  const price = trade.open_price // Mystery field
  const transaction = structuredClone(trade)

  for (const key in transaction) {
    if (!tradeTransInfoFields.includes(key))
      delete transaction[key]
  }
  return Object.assign({ price }, transaction) as Partial<TRADE_TRANS_INFO>
}
