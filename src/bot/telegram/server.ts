import { serve } from 'std/http/server.ts'
import { parse } from './parsers/mod.ts'

async function handler (request: Request) {
  try {
    return new Response(
      Deno.inspect(
        await parse(
          await request.json(
            ))))
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
    console.info('Serving')
    this.connected = true
    return this
  }

  close () {
    this.#ctl.abort()
    this.connected = false
  }

}
