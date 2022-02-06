export type XapiAccount = {
  id: number
  pw?: string
  name: string
  type: 'real' | 'demo'
}

export type XapiConfigAccount = {
  broker: string
  accountId: number
  password: string
  name: string
  type: 'real' | 'demo'
}

export type KucoinConfigAccount = {
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

type ConfigAccount = XapiConfigAccount | KucoinConfigAccount

export type ConfigContainer = {
  Accounts: ConfigAccount[]
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
