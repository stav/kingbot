import { assert } from 'std/testing/asserts.ts'
import * as logging from 'std/log/mod.ts'

import KingBot from 'src/bot/mod.ts'

await logging.setup({ loggers: { default: { level: "WARNING" } } })

Deno.test('bot:env', () => {
  assert(KingBot)
})
