import type { ConfigAccount } from '../config.d.ts'
import type { KingConn } from '../conn.d.ts'

export default class KuConn implements KingConn {

  base = 'https://api.kucoin.com'
  account

  constructor (account: ConfigAccount) {
    this.account = account
  }

  private async resolve (relativePath: string) {
    const url = this.base + '/api/v1/' + relativePath
    const response = await fetch(url)
    return response.ok
      ? (await response.json()).data
      : response
  }

  connect () {
  }

  async time () {
    const time = await this.resolve('timestamp')
    console.log('time', time, new Date(time))
  }

  list (index: number) {
    console.log('CNX', index, this.constructor.name, this.account.name)
  }

}
