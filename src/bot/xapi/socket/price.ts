import type { TICK_RECORD } from '../xapi.d.ts'

import type XapiSocket from './socket.ts'

export async function getPriceQuotes(this: XapiSocket, symbols: string[]) {
  const args = {
    symbols,
    level: 0,
    timestamp: 0,
  }
  const result = await this.fetchCommand('getTickPrices', args)
  return result.quotations as TICK_RECORD[]
}
