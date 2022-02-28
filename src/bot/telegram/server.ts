import { serve } from 'std/http/server.ts'
import { getLogger } from 'std/log/mod.ts'

import { parse } from './parsers/mod.ts'

async function handler (request: Request) {
  const body = await request.json()
  getLogger().info(`Server got ${Deno.inspect(body)}`)
  try {
    return new Response(Deno.inspect(await parse(body)))
  }
  catch (error) {
    return new Response(error)
  }
}

export default class Server {

  #ctl = new AbortController()

  public connected = false

  connect () {
    serve( handler, { signal: this.#ctl.signal } )
    console.log('Serving')
    this.connected = true
    return this
  }

  close () {
    this.#ctl.abort()
    this.connected = false
  }

}