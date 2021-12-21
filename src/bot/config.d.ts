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
}

export type ConfigContainer = {
  Accounts: ConfigAccount[]
}
