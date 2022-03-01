import { getLogger } from 'std/log/mod.ts'

import * as yup from 'https://cdn.skypack.dev/yup'
// import typesYup from 'https://cdn.skypack.dev/@types/yup'

import Logging from 'lib/logging.ts'

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
      getLogger('telegram').warning('No parser found for id:', id)
  }
  // As a last resort let's try all know parsers.
  // This is the case where maybe the user typed in a signal manually.
  return [GoldParser, DowjonesParser, MoneybagsParser]
}

// deno-lint-ignore no-explicit-any
export async function parse (data: any): Promise<TelegramSignal> {
  const logger = getLogger('telegram')
  let parsed, signal

  logger.info('Parsing', data)

  for (const parse of parsers(data.cid)) {
    try {
      parsed = parse(message(data))
      signal = await schema.validate(parsed)
      return signal as TelegramSignal
    }
    catch (error) {
      if (!(error instanceof yup.ValidationError))
        logger.error(error)
    }
    finally {
      logger.info('Parser', parse, 'Parsed', parsed, 'Signal', signal)
      Logging.flush()
    }
  }
  // This following error gets sent back to the client
  throw new Error(`No parsers available for data ${data.cid} ${JSON.stringify(data)}`)
}
