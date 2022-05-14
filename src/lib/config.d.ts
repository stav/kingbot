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

type TelegramAccount = {
  name: string
  api_id: number
  api_hash: string
  exchange_indexes: number[]
  forwards: { [index: number]: number }
  chats: number[]
}

type ExchangeAccount = XapiExchangeAccount

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
  period: 1 | 5 | 15 | 30 | 60 | 240 | 1440 | 10080 | 43200
  symbol: string
  price: number
  time: string
  bars: number
}

export type InputContainer = {
  Hedge: { Assets: Asset[] }
  Price: string[]
  Update: { [index: string]: string | number }
  Signal: string
  Xapi: { Bars: XapiPriceBarsConfig }
}
