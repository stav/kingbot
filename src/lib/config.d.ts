// deno-lint-ignore-file no-explicit-any
type AnyObject = { [index: string]: any }

export type XapiAccount = {
  id: number
  pw?: string
  name: string
  type: 'real' | 'demo'
}

export type XapiExchangeAccount = {
  broker: string
  accountId: number
  password: string
  name: string
  type: 'real' | 'demo'
}

export type ForexExchangeAccount = {
  broker: string
  username: string
  password: string
  appKey: string
  name: string
  type: 'test'
}

type TelegramAccount = {
  name: string
  api_id: number
  api_hash: string
  exchange_index: number
  forwards: { [index: number]: number }
  chats: number[]
}

type ExchangeAccount = XapiExchangeAccount | ForexExchangeAccount

export type ExchangeConfigContainer = {
  Accounts: ExchangeAccount[]
}

export type TelegramChatMap = { [index: number]: string }

export type TelegramConfigContainer = {
  index: number
  ChatMap: TelegramChatMap
  Accounts: TelegramAccount[]
}

interface Asset {
  symbol: string
  volume: number
  digits: number
  modify: number
}

export type XapiPriceBarsConfig = {
  period: number
  symbol: string
  price: number
  time: string
}

export type ForexPriceBarsConfig = {
  price: number
  time: string
  span: number
  bars: number
  type: 'ASK' | 'MID' | 'BID'
  interval: 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | string
}

export type InputContainer = {
  Hedge: { Assets: Asset[] }
  Price: string[]
  Signal: string
  Forex: { Order: AnyObject, Trade: AnyObject, Bars: ForexPriceBarsConfig }
  Xapi: { Bars: XapiPriceBarsConfig }
}
