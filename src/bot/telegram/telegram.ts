import type { KingConn } from '../conn.d.ts'
import Server from './server.ts'

export default class TConn implements KingConn {

  private conns: KingConn[] = []

  private get state () {
    return (this.server.connected)
      ? 'Connected'
      : '-Disconnected'
  }

  readonly server = new Server()

  get connected( ){
    return this.server.connected
  }

  prompt () {
    return this.state.charAt(0)
  }

  list (index: number) {
    const _index = isNaN(index) ? '' : index
    return `CNX ${_index} [${this.prompt()}] ${this.constructor.name}`
  }

  setup (targetConnections: KingConn[]) {
    this.conns = targetConnections
    return this.conns.length
  }

  /** Requires that `setup` is run a priori */
  connect () {
    return this.server.connect(this.conns)
  }

  close () {
    this.server.close()
  }

}
