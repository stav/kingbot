import { getLogger } from 'std/log/mod.ts'

import * as yup from 'https://cdn.skypack.dev/yup'
// import typesYup from 'https://cdn.skypack.dev/@types/yup'

import Logging from 'lib/logging.ts'

import type { TelethonMessage, TelegramSignal } from './parsers.d.ts'
import MoneybagsParser, { MONEYBAGS } from './moneybags.ts'
import DowjonesParser, { DOWJONES } from './dowjones.ts'
import GoldParser, { GOLD } from './gold.ts'

function SignalObjectParser (text: string): TelegramSignal {
  const regex = /(['"])?([a-z0-9A-Z_]+)(['"])?:/g
  const json = text.replace(regex, '"$2": '); // convert {a:1} to {"a":1}
  return JSON.parse(json)
}

const TelethonMessageSchema = yup.object().shape({
  symbol: yup.string().required(),
  volume: yup.number().required(),
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
  }
  // As a last resort let's try all known parsers.
  // This is the case where maybe the user typed in a signal manually.
  return [JSON.parse, SignalObjectParser, GoldParser, DowjonesParser, MoneybagsParser]
}

export async function parse (data: TelethonMessage): Promise<TelegramSignal> {
  const logger = getLogger('telegram')
  let parsed, signal

  logger.info('Parsing', data)

  for (const parse of parsers(data.cid)) {
    try {
      parsed = parse(data.msg)
      signal = await TelethonMessageSchema.validate(parsed)
      return signal as TelegramSignal
    }
    catch (error) {
      if ( !(error instanceof yup.ValidationError) && !(error instanceof SyntaxError) )
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
