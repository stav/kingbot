import type { KingConn } from '../conn.d.ts'
import Server from './server.ts'

export default class TConn implements KingConn {

  private readonly server = new Server()

  private get state () {
    return (this.server.connected)
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
    return Deno.inspect(this.server.connect())
  }

  close () {
    this.server.close()
  }

}
