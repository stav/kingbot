import { getLogger } from 'std/log/mod.ts'

import type TConn from './telegram/telegram.ts'
import type { KingConn } from './conn.d.ts'
import ConnectionFactory from './conn.ts'

import Logging from 'lib/logging.ts'
import { bind } from 'lib/bind.ts'
import { reflect } from 'lib/reflect.ts'
import { inspect } from 'lib/inspect.ts'

// These finals should be in config
const TELEGRAM_SOURCE_INDEX = 0
const TELEGRAM_TARGET_INDEX = 1

export default class KingCount {

  conns: KingConn[] = []

  #currentAccountIndex = 0

  f = [0, 1, 2, 3, 4].map(i => () => this.fKey(i)) // Switch between connections

  inspect: () => void = inspect

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
    return await Logging.setup()
  }

  log () {
    const logger = getLogger()
    logger.debug("Hello world")
    logger.info(123456)
    logger.warning(true)
    logger.error({ foo: "bar", fizz: "bazz" })
    logger.critical("500 Internal server error")
  }

  async prime () {
    this.conns = ConnectionFactory()
    const telegramSourceConnection = this.conns[TELEGRAM_SOURCE_INDEX] as TConn
    const telegramTargetConnection = this.conns[TELEGRAM_TARGET_INDEX]
    telegramSourceConnection.setup(telegramTargetConnection)
    await Logging.setup()
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
