// Webpack GramJS root injection build to get it to run in deno
import './bundle.js'

import config from '../config.ts'

export const { TelegramClient, sessions: { StringSession } } = telegram

// async function logout () {
//   const result  = await this.invoke(new Api.auth.LogOut({}))
//   console.log('Logout', result)
// }
// TelegramClient.prototype.logoutx = logout

export function client () {

  return new TelegramClient(
    new StringSession(config.Telegram.session),
    config.Telegram.apiId,
    config.Telegram.apiHash,
    { useWSS: true }
  )

}
