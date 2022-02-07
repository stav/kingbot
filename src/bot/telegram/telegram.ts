import type { KingConn } from '../conn.d.ts'
import type { TelegramClient } from './client.js'
import { client } from './client.js'

async function input () {
  const buffer = new Uint8Array(1024)
  return await Deno.stdin.read(buffer)
}

export default class TConn implements KingConn {

  client: typeof TelegramClient = null
  session = ''

  prompt () {
    return this.state().charAt(0)
  }

  list (index: number) {
    const _index = isNaN(index) ? '' : index
    return `CNX ${_index} [${this.prompt()}] ${this.constructor.name}`
  }

  connect () {
    this.client = client()
  }

  start () {
    if (!this.client) {
      this.connect()
    }
    this.client.start()
    // this.client.start({
    //   // Login requires session for now
    //   phoneNumber: '+12166660300',
    //   phoneCode  : await input(),
    //   password   : await input(),
    //   onError    : console.error,
    // })
    // const me = await this.client.getMe()
    // const username = me.username ? `(${me.username})` : ''
    // this.session = this.client.session.save()
    // console.log(`Logged in as ${me.id} "${me.firstName}" (${username})`, this.session)
  }

  async send () {
    await this.client.sendMessage('me', { message: "All nice: sent with KB2.0" })
  }

  // async close () {
  //   await this.client.logout()
  //   this.client.session.close()
  // }

  state () {
    if (this.client)
      if (this.session)
        return 'LoggedIn'
      else
        return 'Connected'
    return 'Dead'
  }

}
