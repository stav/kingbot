import { Config } from "https://raw.githubusercontent.com/stav/config/readjson/mod.ts"

type ConfigData = {
  accountId: number
  password: string
  type: 'real' | 'demo'
}

type ConfigXapi = {
  Accounts: ConfigData[]
}

type ConfigContainer = {
  Xapi: ConfigXapi
}

const config: ConfigXapi = ((await Config.load({ file: 'local' })) as ConfigContainer).Xapi

export default config
