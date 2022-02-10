import type { KucoinConfigAccount, XapiConfigAccount } from 'lib/config.d.ts'
import config from 'lib/config.ts'

import type { KingConn } from './conn.d.ts'
import TConn from './telegram/telegram.ts'
import KuConn from './kucoin/kuconn.ts'
import XConn from './xapi/xconn.ts'

export default function () {

  // Telegram is the first connection, index zero (0)
  // Exchange connections start at index one (1)
  const conns: KingConn[] = [new TConn()]

  for (const account of config.Accounts) {

    switch (account.broker) {

      case 'XAPI':
        conns.push(new XConn(account as XapiConfigAccount))
        break

      case 'KUCOIN':
        conns.push(new KuConn(account as KucoinConfigAccount))
        break

      default:
        console.warn(`Can't add account, broker "${account.broker}" not supported.`)
    }

  }

  return conns

}
