import { describe } from 'std/testing/bdd.ts'
import { assertObjectMatch } from 'std/testing/asserts.ts'

import { input } from 'lib/config.ts'

import { parse } from 'src/bot/telegram/parsers/mod.ts'
import { TelethonMessage } from 'src/bot/telegram/parsers/parsers.d.ts'

describe("Signal", async () => {

  const payload = {
    cid: 0,
    fid: '',
    msg: input().Signal,
    date: '',
    eindex: -9,
  } as TelethonMessage

  const signal = await parse(payload)
  assertObjectMatch(signal, {})
  console.log(signal)

})
