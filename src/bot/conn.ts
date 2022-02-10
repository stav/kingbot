import type { KucoinConfigAccount, XapiConfigAccount } from './config.d.ts'
import type { KingConn } from './conn.d.ts'
import TConn from './telegram/drash.ts'
import KuConn from './kucoin/kuconn.ts'
import XConn from './xapi/xconn.ts'
import config from './config.ts'

export default function () {

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
