// deno-lint-ignore-file no-explicit-any
import type { ForexExchangeAccount, ForexPriceBarsConfig } from 'lib/config.d.ts'
import { input } from 'lib/config.ts'

import type { PriceBars } from 'lib/candles.d.ts'
import { priceCandles } from 'lib/candles.ts'

import { Fetch } from 'lib/web.ts'

import type { KingConn } from '../conn.d.ts'

import { get, post } from './web.ts'

type User = {
  Additional2FAMethods: any,
  AdditionalInfo: any,
  AllowedAccountOperator: boolean,
  Is2FAEnabled: boolean,
  PasswordChangeRequired: boolean,
  Session: string,
  StatusCode: number,
  TwoFAToken: any,
  UserType: number,
}

export default class ForConn implements KingConn {

  #tickToggle = false
  private goldId = 0

  base = 'https://ciapi.cityindex.com/tradingapi'
  user = {} as User
  account: ForexExchangeAccount

  constructor (account: ForexExchangeAccount) {
    this.account = account
  }

  private get = get
  private post = post

  prompt () {
    return this.user.Session ? 'l' : '-'
  }

  list (index: number) {
    return `CNX ${index || ''} [${this.prompt()}] ${this.constructor.name} ${this.account.name}`
  }

  async login () {
    const url = this.base + '/session'
    const method = 'POST'
    const headers = {
      "Content-Type": 'application/json',
    }
    const body = JSON.stringify({
      UserName: this.account.username,
      Password: this.account.password,
      AppKey: this.account.appKey,
      AppComments: "Kingbot",
      AppVersion: "1",
    })
    return await Fetch(url, { method, headers, body })
  }

  async connect () {
    const response = await this.login()
    if (response.Session) {
      this.user = response
    }
    return response

  }

  async validate () {
    const url = this.base + '/session/validate'
    const method = 'POST'
    const headers = {
      "Content-Type": 'application/json',
    }
    const body = JSON.stringify({
      UserName: this.account.username,
      Session: this.user.Session,
    })
    return await Fetch(url, { method, headers, body })
    // { IsAuthenticated: true }
  }

  async goldid () {
    if (this.goldId) return this.goldId
    const params = new URLSearchParams()
    params.append('SearchByMarketName', 'true')
    params.append('Query', 'XAU/USD')
    const url = '/market/search?' + params.toString()
    // { Markets: [ { MarketId: 401153870, Name: "XAU/USD", Weighting: 100000 } ] }
    const response = await this.get(url)
    const markets = response.Markets as any[]
    const market = markets.filter(m => m.Name === 'XAU/USD')[0]
    return market.MarketId
  }

  async gold () {
    const id = await this.goldid()
    return await this.get(`/market/${id}/information`)
  }

  async hours () {
    const gold = await this.gold()
    console.log('Hours')
    for (const entry of gold.MarketInformation.MarketPricingTimes) {
      console.log(entry)
    }
    console.log('Breaks')
    for (const entry of gold.MarketInformation.MarketBreakTimes) {
      console.log(entry)
    }
  }

  async simtrade () {
    const url = this.base + '/order/simulate/newtradeorder'
    const body = JSON.stringify(input().Forex.Trade)
    return await this.post(url, { body })
  }

  async simorder () {
    const url = this.base + '/order/simulate/newstoplimitorder'
    const body = JSON.stringify(input().Forex.Order)
    return await this.post(url, { body })
  }

  async chart () {
    const client = await this.client()
    const id = client.ClientAccountId
    return await this.get(`/useraccount/${id}/ChartingEnabled`)
  }

  async client () {
    return await this.get('/useraccount/ClientAndTradingAccount')
  }

  async cfd () {
    return await this.get('/cfd/markets')
  }

  async margin () {
    return [
      await this.get('/margin/ClientAccountMargin'),
      await this.get('/margin/ManagedClientAccountsMargin'),
    ]
  }

  async tags () {
    return await this.get('/market/taglookup')
  }

  async version () {
    const params = new URLSearchParams()
    params.append('AppKey', this.account.appKey)
    const url = '/clientapplication/versioninformation?' + params.toString()
    return await this.get(url)
  }

  close () {
    this.user = {} as User
  }

  async barHistoryToday (config: ForexPriceBarsConfig): Promise<PriceBars & Response> {
    const params = new URLSearchParams()
    params.append('span', config.span.toString())
    params.append('PriceBars', config.bars.toString())
    params.append('priceType', config.type)
    params.append('interval', config.interval)
    const id = await this.goldid()
    const url = `/market/${id}/barhistory?` + params.toString()
    return await this.get(url)
  }

  async barHistoryDate (config: ForexPriceBarsConfig): Promise<PriceBars & Response> {
    const params = new URLSearchParams()
    params.append('span', config.span.toString())
    params.append('maxResults', config.bars.toString())
    params.append('priceType', config.type)
    params.append('interval', config.interval)
    params.append('fromTimestampUTC', new Date(config.time).getTime().toString())
    const id = await this.goldid()
    const url = `/market/${id}/barhistoryafter?` + params.toString()
    return await this.get(url)
  }

  async p () {
    const config = input().Forex.Bars
    if (!this.goldId) await this.connect()
    const prices = await this.barHistoryToday(config)
    if (prices.ok !== false) { // Success if prices.ok is undefined
      priceCandles(prices as PriceBars, config.price)
    }
    return config
  }

  async q () {
    const config = input().Forex.Bars
    if (!this.goldId) await this.connect()
    const prices = await this.barHistoryDate(config)
    if (prices.ok !== false) { // Success if prices.ok is undefined
      // console.debug(prices)
      priceCandles(prices as PriceBars, config.price)
    }
    return config
  }

}
