// Webpack GramJS root injection build to get it to run in deno
import './bundle.js'

import config from '../config.ts'

export const { TelegramClient, sessions: { StringSession } } = telegram

export function client () {

  return new TelegramClient(
    new StringSession(config.Telegram.session),
    config.Telegram.apiId,
    config.Telegram.apiHash,
  )

}
