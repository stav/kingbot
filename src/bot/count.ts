import KingConn from './conn.ts'
import config from './xapi/config.ts'

export default class KingCount {

  Conn: KingConn // TODO Hardcode transition hack

  // deno-lint-ignore no-explicit-any
  conns: any[] = []

  constructor () {
    for (const account of config.Accounts) {
      this.conns.push(new KingConn(account))
    }
    this.Conn = this.conns[0]
  }

  list () {
    console.log('CNX', this.conns)
  }

}
