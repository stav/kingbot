import { getLogger } from 'std/log/mod.ts'

import Logging from 'lib/logging.ts'
import { bind } from 'lib/bind.ts'
import { reflect } from 'lib/reflect.ts'
import { inspect } from 'lib/inspect.ts'
import { Telegram } from 'lib/config.ts'

import type TConn from './telegram/telegram.ts'
import type { KingConn } from './conn.d.ts'
import ConnectionFactory from './conn.ts'
import XConn from './xapi/xconn.ts'

export default class KingCount {

  #currentAccountIndex = 0
  conns: KingConn[] = []
  f = [0, 1, 2, 3, 4].map(i => () => this.#fKey(i)) // Switch between connections

  #fKey (index: number) {
    if (index < this.conns.length)
      return this.#currentAccountIndex = index
  }

  inspect = inspect

  constructor () {
    this.conns = ConnectionFactory()
    const telegramConnection = this.conns[Telegram().index] as TConn
    telegramConnection.setup(this.conns)
    if (!Deno.env.get('TESTING'))
      Logging.setup().then(console.debug)
  }

  get Conn (): KingConn {
    return this.conns[ this.#currentAccountIndex ]
  }

  get availableCommands (): string[] {
    return [
      ...reflect(this).props, // KingCount properties
      ...reflect(this.Conn)?.props.map(p => `Conn.${p}`), // KingCount.Conn properties
    ]
  }

  get prompt () {
    const i = this.#currentAccountIndex
    const p = this.Conn?.prompt() || ''
    return `\n${i}[${p}]> `
  }

  list () {
    return this.conns
      .map((c, i) => c.list(i)) // Run list for all connections
  }

  bind (command: string) {
    if (command) {
      getLogger('binding').info('') // Log blank line
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

  startall () {
    this.conns
      .filter(c => c instanceof XConn)
      .map(c => c as XConn)
      .forEach(async xconn => await xconn.start())
  }

  close () {
    for (const conn of this.conns) {
      conn.close()
    }
  }

}
