import type { KingConn } from './conn.d.ts'
import ConnectionFactory from './conn.ts'

import { bind } from '../lib/bind.ts'
import { reflect } from '../lib/reflect.ts'

import { inspect } from './lib/inspect.ts'

export default class KingCount {

  conns: KingConn[] = ConnectionFactory()

  f: (() => void)[] = []

  currentAccountIndex = 0

  inspect: () => void = inspect

  constructor () {
    // Set the first account active
    if (this.conns.length > 1) {
      this.currentAccountIndex = 1
    }
    // Hardcode five functions that call fKey based on index accessed
    for (let i=5; i--;) {
      this.f[i] = () => this.fKey(i)
    }
  }

  get Conn (): KingConn {
    return this.conns[ this.currentAccountIndex ]
  }

  get availableCommands (): string[] {
    return [
      ...reflect(this).props,
      ...reflect(this.Conn).props.map(p => `Conn.${p}`),
    ]
  }

  bind (command: string) {
    if (command) {
      const fObj = bind(this, command.split('.'))
                || bind(this.Conn, command.split('.'))
      return fObj === undefined
        ? this.availableCommands
        : fObj
    }
  }

  list () {
    for (let i=1; i<this.conns.length; i++) {
      this.conns[i].list(i)
    }
  }

  listDetail () {
    console.log('CNX', this.conns)
  }

  fKey (index: number) {
    if (index < this.conns.length)
      this.currentAccountIndex = index
  }

}
