export const GOLD = -1001151289381

const re = /XAUUSD (?<type>BUY|SELL)\s+[ENTRADA|entrada]+:\s*(?<entry>[\d.]+)\s+SL:\s*(?<sl>[\d.]+)\s+(?<tps>.+)/s

/**
 * Parse signals in the format:
 *
 *   XAUUSD BUY
 *   ENTRADA: 1806
 *
 *   SL: 1796
 *   TP1: 1808
 *   TP2: 1812
 *   TP3: 1821
 *
 * @note The number of TP levels can be variable but we need at least one.
 *
 * @param text
 *
 * @returns { type:'BUY', entry:'1806', sl:'1796', tps:[ 1808, 1812, 1821 ] }
 */
export default function GoldParser (text: string): Record<string, unknown> {
  const message = text || ''
  const symbol = 'GOLD'
  const volume = 0.01

  function tpLabelMap(tpLabel: string) {
    const tpMatch = tpLabel.trim().match(/[\d.]+$/) || [0]
    return +tpMatch[0]
  }

  const m = (message.match(re)?.groups || { tps: '' })
  const tps = m.tps.split('\n').map(tpLabelMap).filter(Boolean)
  const signal = Object.assign( { symbol, volume }, m, { tps } )
  return signal
}
