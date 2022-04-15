// deno-lint-ignore-file no-explicit-any
import type { ForexExchangeAccount } from 'lib/config.d.ts'

import type { KingConn } from '../conn.d.ts'

import { get, post } from './web.ts'
import { connect, login, validate } from './connect.ts'
import { gold, goldId, barHistoryToday, barHistoryDate, p, q } from './gold.ts'
import { cfd, chart, client, hours, margin, simorder, simtrade, tags, version } from './api.ts'

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

  base = 'https://ciapi.cityindex.com/tradingapi'
  user = {} as User
  account: ForexExchangeAccount

  constructor (account: ForexExchangeAccount) {
    this.account = account
  }

  protected get = get
  protected post = post
  protected login = login
  protected validate = validate

  protected cfd = cfd
  protected chart = chart
  protected client = client
  protected hours = hours
  protected margin = margin
  protected simorder = simorder
  protected simtrade = simtrade
  protected tags = tags
  protected version = version

  protected p = p
  protected q = q
  protected gold = gold
  protected goldId = goldId
  public barHistoryDate = barHistoryDate
  public barHistoryToday = barHistoryToday

  connect = connect

  prompt () {
    return this.user.Session ? 'l' : '-'
  }

  list (index: number) {
    return `CNX ${index || ''} [${this.prompt()}] ${this.constructor.name} ${this.account.name}`
  }

  close () {
    this.user = {} as User
  }

}
