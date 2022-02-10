import * as yup from 'https://cdn.skypack.dev/yup'
// import typesYup from 'https://cdn.skypack.dev/@types/yup'

import type { TelegramSignal } from './parsers.d.ts'
import DowjonesParser, { DOWJONES } from './dowjones.ts'
import MoneybagsParser, { MONEYBAGS } from './moneybags.ts'
import GoldParser, { GOLD } from './gold.ts'
import { message, SELV } from './mock.ts'

const schema = yup.object().shape({
  entry: yup.number().required(),
  type: yup.string().trim().required().matches(/(BUY|SELL)/),
  tps: yup.array(yup.number()).required(),
  sl: yup.number().required(),
})

function parsers (id: number) {
  // First check if we know about the given id.
  // This is the case where the signal comes from a monitored channel.
  switch (id) {

    case GOLD:
      return [GoldParser]

    case DOWJONES:
      return [DowjonesParser]

    case MONEYBAGS:
      return [MoneybagsParser]

    case SELV:
    default:
      console.warn('No parser found for id:', id)
  }
  // As a last resort let's try all know parsers.
  // This is the case where maybe the user typed in a signal manually.
  return [GoldParser, DowjonesParser, MoneybagsParser]
}

export async function parse (data: any): Promise<TelegramSignal> {
  console.log('parse()', data)
  for (const parse of parsers(data.cid)) {
    console.log()
    console.log('parse', parse)
    try {
      const parsedMessage = parse(message(data))
      console.log('parsed', parsedMessage)
      const signal = await schema.validate(parsedMessage) as TelegramSignal
      console.log('validated', signal)
      return signal
    }
    catch (error) {
      console.debug(error)
    }
  }
  throw new Error(`No parsers available for data ${data.cid} ${JSON.stringify(data)}`)
}
