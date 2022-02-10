import type { TelegramSignal } from './parsers.d.ts'

export const DOWJONES = 1151289381

const re = /(?<symbol>\w+)\s+(?<type>BUY|SELL)\s+(?<entry>[\d.]+)\s+SL:?\s*(?<sl>[\d.]+)\s+(?<tps>.+)/s

type DowjonesTelegramSignal = {
  sl: string,           // "14360"
  tps: string,          // "TP: 14250\nTP: 14200\nTP: 14050\nTP: 13900 PROPER RISK🔥\n"
  type: 'BUY' | 'SELL', // "SELL"
  entry: string,        // "14280"
  symbol: string,       // "NAS100"
} | undefined

/**
 * Parse Take-profit portion of the signal:
 *
 * @note There may not be any text after the level number.
 * @param tpLabel - Incoming string, ex: TP: 13900 PROPER RISK
 * @constant tpMatch - RegEx match result, ex: ["TP: 13900", "13900"]
 * @returns number - TP level, ex: 13900
 */
function tpLevel(tpLabel: string): number {
  const re = /TP:?\s*([\d.]+)/
  const tpMatch = tpLabel.trim().match(re) || [0,0]
  return +tpMatch[1]
}

/**
 * Parse signals in the format:
 *
 *   NAS100 SELL 14280
 *   SL: 14360
 *   TP: 14250
 *   TP: 14200
 *   TP: 14050
 *   TP: 13900 PROPER RISK
 *
 * @note The number of TP levels can be variable but we need at least one.
 * @param text
 * @returns { type:'SELL', entry:'14280', sl:'14360', tps:[ 14360, 14250, 14200, 14050, 13900 ] }
 */
export default function DowjonesParser (text: string): TelegramSignal | undefined {
  console.log('dowjones', typeof text, Deno.inspect(text))
  const message = text || ''

  const m = message.match(re)?.groups as DowjonesTelegramSignal
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
