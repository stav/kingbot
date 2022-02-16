import { assertEquals, assertArrayIncludes, assertExists } from 'std/testing/asserts.ts'
import * as logging from 'std/log/mod.ts'

import config from 'lib/config.ts'
import { bind } from 'lib/bind.ts'
import { reflect } from 'lib/reflect.ts'

await logging.setup({ loggers: { default: { level: "WARNING" } } })

Deno.test('lib.bind', () => {
  const command = 'a.b'
  const props = command.split('.') // ['a', 'b']
  const result = bind({a: {b: 2}}, props)
  assertEquals(result, 2)
})

Deno.test('lib.config', () => {
  assertExists(config().Accounts)
})

Deno.test('lib.reflect', () => {
  class Class {
    a = 1
    b () {}
  }
  // { props: [ "a", "b" ], fields: [ "a" ], methods: [ "b" ] }
  const result = reflect(new Class())
  assertArrayIncludes(result.props, ['a', 'b'])
  assertArrayIncludes(result.fields, 'a')
  assertArrayIncludes(result.methods, 'b')
})
