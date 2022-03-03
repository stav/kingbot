import * as logging from 'std/log/mod.ts'

import { Rhum } from 'rhum/mod.ts'

import type { XapiExchangeAccount } from 'lib/config.d.ts'

import XConn from 'src/bot/xapi/xconn.ts'

await logging.setup({ loggers: { default: { level: "WARNING" } } })

Rhum.testSuite('connection', () => {

  const account = {
    broker: 'broker',
    accountId: 123456789,
    password: 'pass',
    name: 'test',
    type: 'demo',
  } as XapiExchangeAccount

  Rhum.testCase('should build', () => {
    const conn = new XConn(account)
    Rhum.asserts.assertExists( conn )
    Rhum.asserts.assertExists( conn.Socket )
    Rhum.asserts.assertExists( conn.Stream )
  })

})

Rhum.run()
