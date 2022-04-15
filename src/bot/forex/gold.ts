import type { ForexPriceBarsConfig } from 'lib/config.d.ts'
import { input } from 'lib/config.ts'

import type { PriceBars } from 'lib/candles.d.ts'
import { priceCandles } from 'lib/candles.ts'

import type ForConn from './forex.ts'

let GoldId = 0

export async function goldId (this: ForConn, ) {
  if (!GoldId) {
    const params = new URLSearchParams()
    params.append('SearchByMarketName', 'true')
    params.append('Query', 'XAU/USD')
    const url = '/market/search?' + params.toString()
    // { Markets: [ { MarketId: 401153870, Name: "XAU/USD", Weighting: 100000 } ] }
    const response = await this.get(url)
    // deno-lint-ignore no-explicit-any
    const markets = response.Markets as any[]
    const market = markets.filter(m => m.Name === 'XAU/USD')[0]
    GoldId = market.MarketId
  }
  return GoldId
}

export async function gold (this: ForConn, ) {
  const id = await this.goldId()
  return await this.get(`/market/${id}/information`)
}

export async function barHistoryToday (this: ForConn, config: ForexPriceBarsConfig): Promise<PriceBars & Response> {
  const params = new URLSearchParams()
  params.append('span', config.span.toString())
  params.append('PriceBars', config.bars.toString())
  params.append('priceType', config.type)
  params.append('interval', config.interval)
  const id = await this.goldId()
  const url = `/market/${id}/barhistory?` + params.toString()
  return await this.get(url)
}

export async function barHistoryDate (this: ForConn, config: ForexPriceBarsConfig): Promise<PriceBars & Response> {
  const params = new URLSearchParams()
  params.append('span', config.span.toString())
  params.append('maxResults', config.bars.toString())
  params.append('priceType', config.type)
  params.append('interval', config.interval)
  params.append('fromTimestampUTC', new Date(config.time).getTime().toString())
  const id = await this.goldId()
  const url = `/market/${id}/barhistoryafter?` + params.toString()
  return await this.get(url)
}

async function candles (connection: ForConn, today: boolean) {
  const config = input().Forex.Bars
  if (!GoldId) await connection.connect()
  const prices = (today)
    ? await connection.barHistoryToday(config)
    : await connection.barHistoryDate(config)
  if (prices.ok !== false) { // Success if prices.ok is true or undefined
    const candles = priceCandles(prices as PriceBars, config.price)
    console.info(candles)
  }
  return config
}

export async function p (this: ForConn) {
  return await candles(this, true)
}

export async function q (this: ForConn) {
  return await candles(this, false)
}
