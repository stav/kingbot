import type { XapiPriceBarsConfig } from 'lib/config.d.ts'

import type { TICK_RECORD } from '../xapi.d.ts'

import type XapiSocket from './socket.ts'

export async function getPriceQuotes (this: XapiSocket, symbols: string[]) {
  const args = {
    symbols,
    level: 0,
    timestamp: 0,
  }
  const result = await this.fetchCommand('getTickPrices', args)
  return result.quotations as TICK_RECORD[]
}

export async function getPriceHistory (this: XapiSocket, bars: XapiPriceBarsConfig) {
  console.log('bars', bars)
  const args = {
    info: {
      period: bars.period,
      symbol: bars.symbol,
      start: bars.start,
    },
  }
  console.log('args', args)
  const result = await this.fetchCommand('getChartLastRequest', args)
  console.log('result', result)
  return result.quotations as TICK_RECORD[]
}
