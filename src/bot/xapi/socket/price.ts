import type { XapiPriceBarsConfig } from 'lib/config.d.ts'
import type { PriceBar } from 'lib/candles.d.ts'
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

function getPriceArgs (priceConfig: XapiPriceBarsConfig) {
  let priceArguments: PriceArguments
  if (priceConfig.bars) {
    priceArguments = [
      'getChartRangeRequest',
      {
        info: {
          period: priceConfig.period,
          symbol: priceConfig.symbol,
          start: Date.parse(priceConfig.time.start),
          ticks: priceConfig.bars,
        }
      }
    ]
  }
  else {
    priceArguments = [
      'getChartLastRequest',
      {
        info: {
          period: priceConfig.period,
          symbol: priceConfig.symbol,
          start: Date.parse(priceConfig.time.start),
        }
      }
    ]
  }
  console.log('args', priceArguments)
  return priceArguments
}

export async function getPriceHistory (this: XapiSocket, priceConfig: XapiPriceBarsConfig) {
  function dates (r: RATE_INFO_RECORD) {
    return {
      ctm: r.ctm,
      ctms: r.ctmString,
      date: new Date(r.ctm),
      utc: new Date(r.ctm).toUTCString(),
    }
  }
  const result = await this.fetchCommand(...getPriceArgs(priceConfig))
  if (result.status === false) throw result
  console.log('infos', result.rateInfos.map(dates))
  return result as chartHistory
}

export async function candles (this: XapiSocket, priceConfig: XapiPriceBarsConfig) {
  console.log('priceConfig', priceConfig)

  let history: chartHistory
  try { history = await this.getPriceHistory(priceConfig) } catch (e) { return e }
  console.log('history', history)

  function olhc (rateInfo: RATE_INFO_RECORD) {
    const div = 10 ** history.digits
    const openPrice = rateInfo.open / div
    return {
      BarDate: `/Date(${rateInfo.ctm})/`,
      Low: openPrice + rateInfo.low / div,
      High: openPrice + rateInfo.high / div,
      Open: openPrice,
      Close: openPrice + rateInfo.close / div,
    }
  }
  const bars: PriceBar[] = history.rateInfos.map(olhc)
  const candles = priceCandles(bars, priceConfig)

  return candles
}
