import { Config } from "https://raw.githubusercontent.com/stav/config/readjson/mod.ts"

import { ConfigXapi, ConfigContainer } from './xapi.d.ts'

const config: ConfigXapi = ((await Config.load({ file: 'local' })) as ConfigContainer).Xapi

export default config
