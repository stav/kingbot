// deno-lint-ignore-file no-explicit-any
import { getLogger } from 'std/log/mod.ts'

import { human } from 'lib/time.ts'

import type { TRADE_RECORD, TRADE_TRANS_INFO, STREAMING_TRADE_RECORD } from '../xapi.d.ts'
import { CMD_FIELD, TYPE_FIELD } from '../xapi.ts'

import type XapiSocket from './socket.ts'

type UpdateOrderEvent = Partial<TRADE_TRANS_INFO>

/** @name isBuyOrder */
/**
 * Determine if the given command is for _buying_ (as opposed to _selling_)
 * @todo What if it's a balance or credit order, i.e. not buy or sell
 * @see xapi.ts:CMD_FIELD
 */
function isBuyOrder(cmd: number): boolean {
  return ['BUY', 'BUY_LIMIT', 'BUY_STOP'].includes(CMD_FIELD[cmd])
}

/** @name getLevel */
/**
 * Makes the initial take-profit a little less conservative
 *
 * The `level` in {@link getStopLoss} is the average of open & close unless we
 * are closing TP1 in which case we make the break-even just slightly better
 * than the entry price.
 *
 * @note Technically, the stop loss should, except for TP1, be moved to the
 *   previous TP level, but since we don't have any meta-data about other
 *   orders when we close a TP, the current implementation just sets the SL
 *   to the average of the open & close prices.
 *
 * @todo If somehow the bot misses the break-even from TP1. When we see the
 *   next take-profit, let's say TP2 it will set the SL to the entry price
 *   instead of where it should be (halfway between Open & TP2).
 */
 function getLevel(data: STREAMING_TRADE_RECORD): number {
  const _isBuyOrder = isBuyOrder(data.cmd)
  function stoplossWorseThanEntry(): boolean {
    return _isBuyOrder ? data.sl < data.open_price : data.sl > data.open_price
  }
  if (stoplossWorseThanEntry()) { // This would normally mean that the
    return data.open_price        // break-even has not been moved yet
  }
  const level = (data.open_price + data.close_price) / 2
  getLogger().info('LEVEL', level, '=', data.open_price, '+', data.close_price, '/', 2)
  return level
}

/** @name getStopLoss */
/**
 */
 function getStopLoss(data: STREAMING_TRADE_RECORD): number {
  const level = getLevel(data) // (data.open_price + data.close_price) / 2
  const margin = level * 0.0003
  const betterment = isBuyOrder(data.cmd) ? +margin : -margin
  const stopLoss = +(level + betterment).toFixed(data.digits)
  getLogger().info(`STOP LOSS: ${stopLoss} = ${level} + ${betterment}`)
  return stopLoss
}

function copy (trade: TRADE_RECORD, tpData: STREAMING_TRADE_RECORD) {
  const update: UpdateOrderEvent = {
    cmd: undefined,
    customComment: undefined,
    expiration: undefined,
    offset: undefined,
    order: undefined,
    price: undefined,
    symbol: undefined,
    tp: undefined,
    volume: undefined,
  }
  const transaction = {} as TRADE_TRANS_INFO & { [index: string]: any }
  for (const key in update) {
    // deno-lint-ignore no-prototype-builtins
    if (update.hasOwnProperty(key)) {
      const value = (trade as any)[key]
      if (value !== undefined)
        transaction[key] = value
    }
  }
  return Object.assign(transaction, {
    sl: getStopLoss(tpData),
    type: TYPE_FIELD.MODIFY,
  }) as TRADE_TRANS_INFO
}

/** @name setFamilyStoploss */
/**
 * Issue order stop-loss modification transactions for all orders in _family_
 * @param tpData The take-profit order data sent by the exchange
 * @param trades The order family of trades belonging to the `tpData`
 */
async function setFamilyStoploss( this: XapiSocket,
                                  tpData: STREAMING_TRADE_RECORD,
                                  trades: TRADE_RECORD[],
) {
  const logger = getLogger()
  logger.info(`Updating stop loss for ${trades.length} orders`)

  for (const trade of trades) {
    // The transaction will fail if the take-profit is "worse" than the entry price
    const response = await this.makeTrade(copy(trade, tpData))
    logger.info({ function: 'setFamilyStoploss', 'response': response})
  }
}

type IndexableRecord = STREAMING_TRADE_RECORD & { [index: string]: any }

function translate (data: IndexableRecord) {
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

/** @name check */
/**
 * Check to see if our trade was closed due to _take-profit_.
 *
 * If so then set the _stop-loss_es for all orders in the family.
 *
 * @param data The take-profit order data sent by the exchange
 * @param func The function to set the stop-loss, this is used in testing
 */
export async function check (this: XapiSocket, data: STREAMING_TRADE_RECORD, func = setFamilyStoploss) {
  function symbolStoploss(trade: TRADE_RECORD) {
    return trade.symbol === data.symbol
      && trade.sl === data.sl
  }
  if (data.closed && data.comment === '[T/P]') {
    getLogger().info('TAKE PROFIT', translate(data))

    const openedOnly = true

    const trades: TRADE_RECORD[] = await this.getOpenTrades(openedOnly)
    getLogger().info(`check1: ${trades.length} open trades in total`)

    const family = trades.filter(symbolStoploss)
    getLogger().info(`check2: ${family.length} in family of ${data.symbol}`)

    if (family.length > 0) {
      await func.bind(this)(data, family)
    }
  }
  else {
    getLogger().debug('Order not a take-profit:', data.state)
  }
}

export const testing = {
  check,
  getLevel,
  getStopLoss,
  setFamilyStoploss,
}
