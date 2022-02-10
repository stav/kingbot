import type { TelegramSignal } from './parsers.d.ts'

export const MONEYBAGS = 1151289381

const re = /(?<symbol>\w+)\s+(?<type>BUY|SELL)\s+ENTRADA: (?<entry>[\d.]+)\s+SL = \s*(?<sl>[\d.]+)\s+\([\d]+ PIPS\)\s+(?<tps>.+)/s

type MoneybagsTelegramSignal = {
  sl: string,           // "35576"
  tps: string,          // "TP1 = 35696 (20 PIPS)\nTP2 = 35716 (40 PIPS)\nTP3 = 35736 (60 PIPS)\nTP4 = 35776 (100 PIPS)"
  type: 'BUY' | 'SELL', // "BUY"
  entry: string,        // "35676"
  symbol: string,       // "US30"
} | undefined

/**
 * Parse Take-profit portion of the signal:
 *
 * @note There may not be any text after the level number.
 * @param tpLabel - Incoming string, ex: TP1 = 35696 (20 PIPS)
 * @constant tpMatch - RegEx match result, ex: ["TP1 = 35696", "35696"]
 * @returns number, ex: 35696
 */
function tpLevel(tpLabel: string): number {
  const re = /TP\d\d? = ([\d.]+)/
  const tpMatch = tpLabel.trim().match(re) || [0,0]
  return +tpMatch[1]
}

/**
 * Parse signals in the format:
 *
 *   [Forwarded from MONEY BAGS PRO]
 *   US30 BUY
 *   ENTRADA: 35676
 *
 *   SL = 35576 (100 PIPS)
 *   TP1 = 35696 (20 PIPS)
 *   TP2 = 35716 (40 PIPS)
 *   TP3 = 35736 (60 PIPS)
 *   TP4 = 35776 (100 PIPS)
 *
 * @note The number of TP levels can be variable but we need at least one.
 * @param text
 * @returns { volume:0.01, symbol:"US30", type:"BUY", entry:35676, sl:35576, tps:[35696,35716,35736,35776] }
 */
export default function MoneybagsParser (text: string): TelegramSignal | undefined {
  const message = text || ''

  const m = message.match(re)?.groups as MoneybagsTelegramSignal
  if (m?.tps) {
    const tps = m.tps.split('\n').map(tpLevel).filter(Boolean)
    return Object.assign(
      { volume: 0.01 },
      m,
      {
        entry: +m.entry,
        sl: +m.sl,
        tps,
      },
    ) as TelegramSignal
  }
}
