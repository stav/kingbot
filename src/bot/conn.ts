import type { ConfigAccount } from './config.d.ts'
import type { KingConn } from './conn.d.ts'
import KuConn from './kucoin/kuconn.ts'
import XConn from './xapi/xconn.ts'
import config from './config.ts'

const dummy =  new XConn({} as ConfigAccount) as KingConn

export default function () {

  const conns: KingConn[] = [dummy] // Dummy account so conns is one-indexed

  for (const account of config.Accounts) {

    switch (account.broker) {

      case 'XAPI':
        conns.push(new XConn(account))
        break

      case 'KUCOIN':
        conns.push(new KuConn(account))
        break

      default:
        break
    }

  }

  return conns

}
