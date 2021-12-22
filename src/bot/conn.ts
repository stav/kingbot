import type { ConfigAccount } from './config.d.ts'
import XConn from './xapi/xconn.ts'
import config from './config.ts'

const dummy =  new XConn({} as ConfigAccount)

export default function () {

  const conns = [dummy] // Dummy account so conns is one-indexed

  for (const account of config.Accounts) {

    if (account.broker === 'XAPI') {
      conns.push(new XConn(account))
    }

  }

  return conns

}
