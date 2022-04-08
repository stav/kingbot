import type { TRADE_TRANS_INFO } from '../bot/xapi/xapi.d.ts'

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
  exchange_index: number
  chats: number[]
}

type ExchangeAccount = XapiExchangeAccount

export type ExchangeConfigContainer = {
  Accounts: ExchangeAccount[]
}

export type TelegramConfigContainer = {
  index: number
  Accounts: TelegramAccount[]
}

interface Asset {
  symbol: string
  volume: number
  digits: number
  modify: number
}

export type InputContainer = {
  Hedge: { Assets: Asset[] }
  Price: string[]
}
