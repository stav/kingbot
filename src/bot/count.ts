import type { Logger } from 'std/log/mod.ts'

import type { KingConn } from './conn.d.ts'
import ConnectionFactory from './conn.ts'

import Logging from 'lib/logging.ts'
import { bind } from 'lib/bind.ts'
import { reflect } from 'lib/reflect.ts'
import { inspect } from 'lib/inspect.ts'

export default class KingCount {

  conns: KingConn[] = []

  #currentAccountIndex = 0

  f = [0, 1, 2, 3, 4].map(i => () => this.fKey(i)) // Switch between connections

  logger: Logger | null = null

  inspect: () => void = inspect

  constructor () {
    // Set the first account active
    if (this.conns.length > 1) {
      this.#currentAccountIndex = 1
    }
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

  async logging () {
    await Logging.setup()
    return this.logger = Logging.logger()
  }

  log () {
    if (this.logger) { // Narrowing to please the linter
      this.logger.debug("Hello world");
      this.logger.info(123456);
      this.logger.warning(true);
      this.logger.error({ foo: "bar", fizz: "bazz" });
      this.logger.critical("500 Internal server error");
    }
  }

  prime () {
    this.conns = ConnectionFactory()
    return this.list()
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
  }

  fKey (index: number) {
    if (index < this.conns.length)
      return this.#currentAccountIndex = index
  }

}
