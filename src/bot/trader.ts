import { getLogger } from 'std/log/mod.ts'

import { trade as xtrade } from './xapi/xtrader.ts'
import XConn from './xapi/xconn.ts'

import type { TelegramSignal } from './telegram/parsers/parsers.d.ts'

import type { KingConn } from './conn.d.ts'

/**
 * Apply global strategies to signal.
 *
 * zero (0) orders for TP1
 * two (2) orders for TP2
 * one (1) order for TP3
 * one (1) order for Tp4
 *
 * @param signal The parsed tip we get from Telegram
 * @returns The signal possibly modified
 */
function strategy (signal: TelegramSignal) {
  if (signal.tps.length > 3) {
    signal.tps[0] = signal.tps[1]
  }
  return signal
}

/**
 * Generic trading class
 *
 * Lifecycle:
 *
 *   1. Count creates a new Trader with all its connections
 *   2. Count runs setup() on the Telegram connection with the trader object
 *   3. Telegram setup method saves the trader object
 *   4. User runs TConn.connect() which runs TConn.server.connect(trader)
 *   5. TConn server listens for signals
 *   6. TConn server handler runs trader.signalTrades() with signal
 *   7. signalTrades runs signalTrade() for each Exchange
 *   8. signalTrade runs the exchange's trade function
 */
export class Trader {

  conns: KingConn[]

  constructor (conns: KingConn[]) {
    this.conns = conns
  }

  async signalTrade (eindex: number, signal: TelegramSignal) {
    const connection = this.conns[eindex]
    if (connection instanceof XConn) {
      return await xtrade(connection.Socket, signal)
    }
    return [getLogger('tserver').error(
      'Connection not supported', connection, 'at index', eindex, 'for signal', signal)]
  }

  // async *signalTradesGenerator (eindexes: number[], signal: TelegramSignal) {
  //   for (const eindex of eindexes) {
  //     yield await this.signalTrade(eindex, strategy(signal))
  //   }
  // }

  /**
   * Execute trades for each known exchange.
   *
   * We are sending all the orders to the server at once (in parallel).
   *
   * @todo Throttle trades
   *
   * @param eindexes Exchange index number
   * @param signal Telegram signal for what to buy or sell
   */
  async signalTrades (eindexes: number[], signal: TelegramSignal) {
    signal = strategy(signal)
    return await Promise.all(
      eindexes.map(
        eindex => this.signalTrade(eindex, signal)
      )
    )
  }

}
