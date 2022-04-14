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

export type InputContainer = {
  Hedge: { Assets: Asset[] }
  Price: string[]
}
