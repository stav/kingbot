import {
  assertNotStrictEquals,
  assertArrayIncludes,
  assertStrictEquals,
  assertExists,
} from 'std/testing/asserts.ts'
import * as logging from 'std/log/mod.ts'

import { input, Exchange, Telegram } from 'lib/config.ts'
import { human } from 'lib/time.ts'

import { bind } from 'lib/bind.ts'
import { reflect } from 'lib/reflect.ts'

await logging.setup({ loggers: { default: { level: "WARNING" } } })

Deno.test('lib.bind', () => {
  const object = {a: {b: 2}, c: () => {}}

  const command = 'a.b'
  const props = command.split('.') // ['a', 'b']
  let result = bind(object, props)
  assertStrictEquals(result, 2)

  result = bind(object, ['c'])
  assertStrictEquals(typeof result, 'function')

  assertStrictEquals(bind(null, []), undefined)
})

Deno.test('lib.config', () => {
  assertExists(input().Hedge.Assets)

  const eaccounts = Exchange().Accounts
  assertExists(eaccounts)
  assertStrictEquals(eaccounts.constructor.name, 'Array')
  assertNotStrictEquals(eaccounts.length, 0)

  const taccounts = Telegram().Accounts
  assertExists(taccounts)
  assertStrictEquals(taccounts.constructor.name, 'Array')
  assertNotStrictEquals(taccounts.length, 0)
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

Deno.test('lib.time', () => {
  assertStrictEquals( human({}), '0h0m0s' )
  assertStrictEquals( human({s: 1}), '0h0m1s' )
  assertStrictEquals( human({m: 1}), '0h1m0s' )
  assertStrictEquals( human({h: 1}), '1h0m0s' )
  assertStrictEquals( human({m: 61}), '1h1m0s' )
  assertStrictEquals( human({s: 121}), '0h2m1s' )
  assertStrictEquals( human({s: 3661}), '1h1m1s' )
  assertStrictEquals( human({m: 2, s: 1}), '0h2m1s' )
})
