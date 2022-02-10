import type { Context } from 'https://deno.land/x/oak/mod.ts'
import { Application } from 'https://deno.land/x/oak/mod.ts'

import Logger from '../../log.ts'

async function middleware (ctx: Context) {
  const type = ctx.request.body().type
  const body = await ctx.request.body().value
  const data = Deno.inspect(body)
  ctx.response.body = `Oak received: ${type} "${data}"`
  Logger.info(Deno.inspect(ctx))
  Logger.info('Oak Request: ' + data)
}

export default class Server {

  #port = 8000
  #host = '127.0.0.1'
  #ctl = new AbortController()

  private readonly app = new Application()

  public connected = false

  connect() {
    this.app.use(middleware)
    this.app.listen({
      port: this.#port,
      hostname: this.#host,
      signal: this.#ctl.signal,
    })
    this.connected = true
  }

  close () {
    this.#ctl.abort()
    this.connected = false
  }

}
