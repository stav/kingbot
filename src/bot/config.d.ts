export type Account = {
  id: number
  pw?: string
  name: string
  type: 'real' | 'demo'
}

export type ConfigAccount = {
  broker: string
  accountId: number
  password: string
  name: string
  type: 'real' | 'demo'
  api?: {
    key: string
    secret: string
    passphrase: string
  }
}

export type ConfigContainer = {
  Accounts: ConfigAccount[]
}
