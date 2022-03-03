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

export type KucoinExchangeAccount = {
  broker: string
  accountId: string
  password: string
  name: string
  type: 'live' | 'sandbox'
  api: {
    key: string
    secret: string
    passphrase: string
  }
}

type TelegramAccount = {
  name: string
  api_id: number
  api_hash: string
  exchange_index: number
  chats: number[]
}

type ExchangeAccount = XapiExchangeAccount | KucoinExchangeAccount

export type ConfigContainer = {
  Exchanges: ExchangeAccount[]
  Telegram: {
    index: number
    Accounts: TelegramAccount[]
  }
}

interface Asset {
  symbol: string
  volume: number
  digits: number
  modify: number
}

export type InputContainer = {
  Hedge: { Assets: Asset[] }
}
