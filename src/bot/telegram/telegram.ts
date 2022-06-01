import { Bot } from "https://deno.land/x/grammy@v1.5.5/mod.ts"

import type { KingConn } from '../conn.d.ts'
import KingCount from '../count.ts'

import Server from './server.ts'

export default class TConn implements KingConn {

  #welcome = 'Welcome. Up and running.'
  #help = '/help\n/start\n'

  private conns: KingConn[] = []

  private get state () {
    return (this.server.connected)
      ? 'Connected'
      : '-Disconnected'
  }

  readonly server = new Server()

  tbot = new Bot('5049582933:AAHkCMwuf4YLdMr0cZ8ADU8S2DhDHBp2Fj0')
  chatId: string | number = '1018859271'

  get connected () {
    return this.server.connected
  }

  prompt () {
    return this.state.charAt(0)
  }

  list (index: number) {
    const _index = isNaN(index) ? '' : index
    return `CNX ${_index} [${this.prompt()}] ${this.constructor.name}`
  }

  setup (kingcount: KingCount) {
    const targetConnections: KingConn[] = kingcount.conns
    this.tbot.command("help", ctx => ctx.reply(this.#help))
    this.tbot.command("start", ctx => ctx.reply(this.#welcome))
    this.tbot.on("message", ctx => this.charge(kingcount, ctx))
    this.tbot.catch((err) => {
      console.error(`Error while handling update ${err.ctx.update.update_id}:`)
      console.error("Unknown error:", err.error)
    })
    this.tbot.start()
    this.conns = targetConnections
    console.log('tbot', this.tbot)
    return this.conns.length
  }

  /** Requires that `setup` is run a priori */
  connect () {
    return this.server.connect(this.conns)
  }

  // deno-lint-ignore no-explicit-any
  private async charge (kingcount: KingCount, ctx: any) {
    console.log('charge: kingcount', kingcount)
    console.log('charge: ctx', ctx)
    if (this.tbot) {
      const input: string = ctx.message.text
      const obj = kingcount.bind(input)
      await this.tbot.api.sendMessage(this.chatId, `${typeof obj} ${obj}`)
      if (typeof obj === 'function') {
        const output = obj()
        if (output !== undefined)
          await this.tbot.api.sendMessage(this.chatId, output)
      }
    }
  }

  close () {
    this.tbot.stop().catch(console.error)
    this.server.close()
  }

}
