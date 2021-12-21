import { Config } from "https://raw.githubusercontent.com/stav/config/readjson/mod.ts"

import type { ConfigContainer } from './config.d.ts'

export default await Config.load({ file: 'local' }) as ConfigContainer
