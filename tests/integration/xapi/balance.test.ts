import { deadline, delay } from 'std/async/mod.ts'
import * as logging from 'std/log/mod.ts'

import { Rhum } from 'rhum/mod.ts'

import type { XapiExchangeAccount } from 'lib/config.d.ts'
import config from 'lib/config.ts'

import XConn from 'src/bot/xapi/xconn.ts'

await logging.setup({ loggers: { default: { level: "WARNING" } } })

const TEST_INDEX = 0 // TODO config

Rhum.testSuite('balance', () => {

  const account = config().Exchanges[TEST_INDEX] as XapiExchangeAccount

  Rhum.testCase('should be a number', async () => {
    const conn = new XConn(account)
    const balance = await conn.balance()

    // Close the connection
    conn.Socket.close()
    async function wait () { while (!conn.Socket.isClosed) await delay(200) }
    await deadline(wait(), 2000)

    Rhum.asserts.assertStrictEquals( typeof balance, 'number' )
  })

})

Rhum.run()
