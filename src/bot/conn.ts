import type { ConfigAccount } from './config.d.ts'

import XConn from './xapi/xconn.ts'

export default function (account = {} as ConfigAccount) {

  return new XConn(account)

}
