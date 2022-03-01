import type { KingConn } from '../conn.d.ts'
import type XConn from '../xapi/xconn.ts'

import { serve } from 'std/http/server.ts'
import { parse } from './parsers/mod.ts'

export default class Server {

  #ctl = new AbortController()

  private connection: XConn | null = null

  public connected = false

  async handler (request: Request) {
    try {
      const payload = await request.json()
      const parsed = await parse(payload)
      return new Response(Deno.inspect(parsed))
    }
    catch (error) {
      return new Response(error)
    }
  }

  connect (connection: KingConn | null) {
    this.connection = connection as XConn
    serve( this.handler, { signal: this.#ctl.signal } )
    this.connected = true
    const url = 'http://localhost:8000'
    const account = Deno.inspect(this.connection.Socket.account)
    return `Listening to ${url} for ${account}`
  }

  close () {
    this.#ctl.abort()
    this.connected = false
  }

}
