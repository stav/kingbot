import type { KingConn } from '../conn.d.ts'
import { Trader } from '../trader.ts'
import Server from './server.ts'

export default class TConn implements KingConn {

  private conns: KingConn[] = []

  private get state () {
    return (this.server.connected)
      ? 'Connected'
      : '-Disconnected'
  }

  readonly server = new Server()

  public trader: Trader | null = null

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

  setup (trader: Trader) {
    this.trader = trader
  }

  /** Requires that `setup` is run a priori */
  connect () {
    if (this.trader)
      return this.server.connect(this.trader)
    else
      return 'TConn.setup() must be run before connect()'
  }

  close () {
    this.server.close()
  }

}
