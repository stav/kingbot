import type { KingConn } from './conn.d.ts'
import ConnectionFactory from './conn.ts'

import { bind } from '../lib/bind.ts'
import { reflect } from '../lib/reflect.ts'

import type TConn from './telegram/telegram.ts'
import { inspect } from './lib/inspect.ts'

export default class KingCount {

  conns: KingConn[] = ConnectionFactory()

  f: (() => number | void)[] = []

  #currentAccountIndex = 0

  inspect: () => void = inspect

  constructor () {
    // Set the first account active
    if (this.conns.length > 1) {
      this.#currentAccountIndex = 1
    }
    // Hardcode five functions that call fKey based on index accessed
    for (let i=5; i--;) {
      this.f[i] = () => this.fKey(i)
    }
  }
  private get TConn (): TConn {
    return this.conns[0] as TConn
  }
  get Conn (): KingConn {
    return this.conns[ this.#currentAccountIndex ]
  }

  get availableCommands (): string[] {
    return [
      ...reflect(this).props, // KingCount properties
      ...reflect(this.Conn).props.map(p => `Conn.${p}`), // KingCount.Conn properties
    ]
  }

  get prompt () {
    const i = this.#currentAccountIndex
    const p = this.Conn.prompt()
    return `\n${i}[${p}]> `
  }

  bind (command: string) {
    if (command) {
      // First try to bind to KingCount
      let fObj = bind(this, command.split('.'))
      // Secondly try to bind to the Connection
      if (fObj === undefined)
        fObj = bind(this.Conn, command.split('.'))
      // Return bound object (or command list)
      return (fObj === undefined)
        ? this.availableCommands
        : fObj
    }
  }

  list () {
    return this.conns
      .map((c, i) => c.list(i)) // Run list for all connections
      // .filter((_c, i) => i > 0) // Ignore the first result (Telegram)
  }

  fKey (index: number) {
    if (index < this.conns.length)
      return this.#currentAccountIndex = index
  }

}
