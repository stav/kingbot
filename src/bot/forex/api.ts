import { input } from 'lib/config.ts'

import type ForConn from './forex.ts'

export async function hours (this: ForConn) {
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

export async function simtrade (this: ForConn) {
  const url = this.base + '/order/simulate/newtradeorder'
  const body = JSON.stringify(input().Forex.Trade)
  return await this.post(url, { body })
}

export async function simorder (this: ForConn) {
  const url = this.base + '/order/simulate/newstoplimitorder'
  const body = JSON.stringify(input().Forex.Order)
  return await this.post(url, { body })
}

export async function chart (this: ForConn) {
  const client = await this.client()
  const id = client.ClientAccountId
  return await this.get(`/useraccount/${id}/ChartingEnabled`)
}

export async function client (this: ForConn) {
  return await this.get('/useraccount/ClientAndTradingAccount')
}

export async function cfd (this: ForConn) {
  return await this.get('/cfd/markets')
}

export async function margin (this: ForConn) {
  return [
    await this.get('/margin/ClientAccountMargin'),
    await this.get('/margin/ManagedClientAccountsMargin'),
  ]
}

export async function tags (this: ForConn) {
  return await this.get('/market/taglookup')
}

export async function version (this: ForConn) {
  const params = new URLSearchParams()
  params.append('AppKey', this.account.appKey)
  const url = '/clientapplication/versioninformation?' + params.toString()
  return await this.get(url)
}
