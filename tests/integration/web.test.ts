import * as logging from 'std/log/mod.ts'

import { Rhum } from 'rhum/mod.ts'

import { Fetch } from 'lib/web.ts'

await logging.setup({ loggers: { default: { level: "WARNING" } } })

Rhum.testSuite("web", () => {

  Rhum.testCase("should return valid object", async () => {
    const url = 'http://echo.jsontest.com/key/value'
    const result = await Fetch(url)
    Rhum.asserts.assertInstanceOf( result, Object )
    Rhum.asserts.assertObjectMatch( result, { "key": "value" } )
  })

})

Rhum.run()
