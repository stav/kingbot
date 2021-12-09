import { Config } from "https://raw.githubusercontent.com/stav/config/readjson/mod.ts"

type ConfigData = {
  accountId: number
  password: string
  type: 'real' | 'demo'
}

type ConfigXapi = {
  Xapi: ConfigData
}

const config: ConfigData = ((await Config.load({ file: 'local' })) as ConfigXapi).Xapi

export default config
