import KingConn from './conn.ts'
import config from './config.ts'

export default class KingCount {

  conns: KingConn[] = [KingConn.dummy()] // Dummy account so conns is one-indexed

  f: (() => void)[] = []

  currentAccountIndex = 0

  constructor () {
    // Hardcode five functions that call fKey based on index accessed
    for (let i=5; i--;) {
      this.f[i] = () => this.fKey(i)
    }
    // Create a separate connection for each account
    for (const account of config.Accounts) {
      this.conns.push(new KingConn(account))
    }
    // Set the first account active
    if (this.conns.length > 1) {
      this.currentAccountIndex = 1
    }
  }

  get Conn (): KingConn | null {
    return this.currentAccountIndex < this.conns.length
      ? this.conns[ this.currentAccountIndex ]
      : null
  }

  list () {
    for (let i=1; i<this.conns.length; i++) {
      this.conns[i].list(i)
    }
  }

  listDetail () {
    console.log('CNX', this.conns)
  }

  fKey (index: number) {
    if (index > 0 && index < this.conns.length)
      this.currentAccountIndex = index
  }

}
