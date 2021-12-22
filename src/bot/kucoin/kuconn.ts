import type { ConfigAccount } from '../config.d.ts'
import type { KingConn } from '../conn.d.ts'

export default class KuConn implements KingConn {

  base = 'https://api.kucoin.com'
  account

  constructor (account: ConfigAccount) {
    this.account = account
  }

  connect () {
  }

  async time () {
    const url = this.base + '/api/v1/timestamp'
    const response = await fetch(url)
    if (response.ok) {
      const result = await response.json()
      const date = new Date(result.data)
      console.log('time', result.data, date)
    }
    else {
      console.log('response', response)
    }
  }

  list (index: number) {
    console.log('CNX', index, this.constructor.name, this.account.name)
  }

}
