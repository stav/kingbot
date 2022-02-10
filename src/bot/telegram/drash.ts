import * as Drash from 'https://deno.land/x/drash@v2.5.1/mod.ts'

import Logger from '../../log.ts'

import type { KingConn } from '../conn.d.ts'

class HomeResource extends Drash.Resource {
  public paths = ["/"]

  public GET(request: Drash.Request, response: Drash.Response): void {
    Logger.info(Deno.inspect(request))
    response.json({ hello: "world", time: new Date() })
    Logger.info(Deno.inspect(response))
  }
}

export default class TConn implements KingConn {

  #connected = false
  #hostname = '127.0.0.1'
  #port = 1778
  private readonly server: Drash.Server

  constructor () {
    this.server = new Drash.Server({
      port: this.#port,
      protocol: 'http',
      hostname: this.#hostname,
      resources: [HomeResource],
    });
  }

  private get state () {
    return (this.#connected)
      ? 'Connected'
      : '-Disconnected'
  }

  prompt () {
    return this.state.charAt(0)
  }

  list (index: number) {
    const _index = isNaN(index) ? '' : index
    return `CNX ${_index} [${this.prompt()}] ${this.constructor.name}`
  }

  connect () {
    this.server.run()
    this.#connected = true
    const server = Deno.inspect(this.server)
    return `${server} running at ${this.server.address}.`
  }

  close () {
    this.server.close()
    this.#connected = false
  }

}
