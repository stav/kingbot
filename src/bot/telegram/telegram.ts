import type { KingConn } from '../conn.d.ts'
import Server from './server.ts'

export default class TConn implements KingConn {

  private readonly server = new Server()
  private target: KingConn | null = null

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

  setup (targetConnection: KingConn) {
    this.target = targetConnection
  }

  /** Requires that `setup` is run a priori */
  connect () {
    return this.server.connect(this.target)
  }

  close () {
    this.server.close()
  }

}
