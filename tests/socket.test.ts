import * as logging from 'std/log/mod.ts'

import { Rhum } from 'rhum/mod.ts'

import Socket from 'src/bot/socket.ts'

await logging.setup({ loggers: { default: { level: "WARNING" } } })

Rhum.testSuite("socket", () => {

  // Rhum doesn't allow beforeEach unless testSuite is wrapped in testPlan
  class TestSocket extends Socket { }

  Rhum.testCase("should be null", () => {
    const socket = new TestSocket()
    Rhum.asserts.assertStrictEquals( socket.socket, null)
  })

  Rhum.testCase("should not be open", () => {
    const socket = new TestSocket()
    Rhum.asserts.assertEquals( socket.isOpen, false )
  })

})

Rhum.run()
