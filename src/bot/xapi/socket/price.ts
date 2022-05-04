import type { XapiPriceBarsConfig } from 'lib/config.d.ts'
import type { PriceBar, PriceBars } from 'lib/candles.d.ts'
import { priceCandles } from 'lib/candles.ts'

import type { TICK_RECORD } from '../xapi.d.ts'

import type XapiSocket from './socket.ts'
import type { chartHistory, PriceArguments, RATE_INFO_RECORD } from './price.d.ts'

export async function getPriceQuotes (this: XapiSocket, symbols: string[]) {
  const args = {
    symbols,
    level: 0,
    timestamp: 0,
  }
  const result = await this.fetchCommand('getTickPrices', args)
  return result.quotations as TICK_RECORD[]
}

function getPriceArgs (bars: XapiPriceBarsConfig) {
  let priceArguments: PriceArguments
  if (bars.bars) {
    priceArguments = [
      'getChartRangeRequest',
      {
        info: {
          period: bars.period,
          symbol: bars.symbol,
          start: Date.parse(bars.time),
          ticks: bars.bars,
        }
      }
    ]
  }
  else {
    priceArguments = [
      'getChartLastRequest',
      {
        info: {
          period: bars.period,
          symbol: bars.symbol,
          start: Date.parse(bars.time),
        }
      }
    ]
  }
  console.log('args', priceArguments)
  return priceArguments
}

export async function getPriceHistory (this: XapiSocket, bars: XapiPriceBarsConfig) {
  function x (r: RATE_INFO_RECORD) {
    return {
      ctm: r.ctm,
      ctms: r.ctmString,
      date: new Date(r.ctm),
      utc: new Date(r.ctm).toUTCString(),
    }
  }
  const result = await this.fetchCommand(...getPriceArgs(bars))
  if (result.status === false) throw result
  console.log('infos', result.rateInfos.map(x))
  return result as chartHistory
}

export async function candles (this: XapiSocket, bars: XapiPriceBarsConfig) {
  console.log('bars', bars)

  let prices: chartHistory
  try { prices = await this.getPriceHistory(bars) } catch (e) { return e }
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
