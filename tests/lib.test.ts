import { assertEquals, assertArrayIncludes, assertExists } from 'std/testing/asserts.ts'
import * as logging from 'std/log/mod.ts'

import config from 'lib/config.ts'
import { bind } from 'lib/bind.ts'
import { reflect } from 'lib/reflect.ts'

await logging.setup({ loggers: { default: { level: "WARNING" } } })

Deno.test('lib.bind', () => {
  const object = {a: {b: 2}, c: () => {}}

  const command = 'a.b'
  const props = command.split('.') // ['a', 'b']
  let result = bind(object, props)
  assertEquals(result, 2)

  result = bind(object, ['c'])
  assertEquals(typeof result, 'function')

  assertEquals(bind(null, []), undefined)
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
