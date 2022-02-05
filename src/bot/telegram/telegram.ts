import type { KingConn } from '../conn.d.ts'
import type { TelegramClient } from './client.js'
import { client } from './client.js'

export default class TConn implements KingConn {

  client: typeof TelegramClient = null

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

  async start () {
    await this.client.start()
  }

  async send () {
    await this.client.sendMessage('@kingcrossing', { message: "This is good: sent with KB2.0" })
  }

  state ( ){
    return 'XStubbed'
  }

}
