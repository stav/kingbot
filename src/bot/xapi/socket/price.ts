import type { XapiPriceBarsConfig } from 'lib/config.d.ts'
import type { PriceBar, PriceBars } from 'lib/candles.d.ts'
import { priceCandles } from 'lib/candles.ts'

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

type RATE_INFO_RECORD = {
  ctm: number       // CEST time zone needs to be converted to UTC
  ctmString: string // CEST "Apr 29, 2022, 12:00:00 AM"
  open: number      // Open price (in base currency * 10**digits)
  close: number     // Value of close price (shift from open price)
  high: number      // Highest value in the given period (shift from open price)
  low: number       // Lowest value in the given period (shift from open price)
  vol: number       // Volume in lots
}

type chartHistory = {
  digits: number
  rateInfos: RATE_INFO_RECORD[]
}

export async function getPriceHistory (this: XapiSocket, bars: XapiPriceBarsConfig) {
  const args = {
    info: {
      period: bars.period,
      symbol: bars.symbol,
      start: Date.parse(bars.time),
    },
  }
  console.log('args', args)

  function x (r: RATE_INFO_RECORD) {
    return {
      ctm: r.ctm,
      ctms: r.ctmString,
      date: new Date(r.ctm),
      utc: new Date(r.ctm).toUTCString(),
    }
  }

  const result = await this.fetchCommand('getChartLastRequest', args)
  console.log('infos', result.rateInfos.map(x))
  return result as chartHistory
}

export async function candles (this: XapiSocket, bars: XapiPriceBarsConfig) {
  console.log('bars', bars)

  const prices = await this.getPriceHistory(bars)
  console.log('prices', prices)

  function x (rateInfo: RATE_INFO_RECORD) {
    const div = 10 ** prices.digits
    const openPrice = rateInfo.open / div
    return {
      BarDate: `/Date(${rateInfo.ctm})/`,
      Low: openPrice + rateInfo.low / div,
      High: openPrice + rateInfo.high / div,
      Open: openPrice,
      Close: openPrice + rateInfo.close / div,
    }
  }
  const priceBars: PriceBars = {
    PriceBars: prices.rateInfos.map(x),
    PartialPriceBar: {} as PriceBar,
  }
  console.log('priceBars', priceBars)

  const candles = priceCandles(priceBars, bars.price)
  return candles
}
