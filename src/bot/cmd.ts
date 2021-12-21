// deno-lint-ignore-file no-explicit-any
import Logger from '../log.ts'
import KingCount from './count.ts'

type KeyMap = {
  [key: string]: string
}

/** funcMap
 *
 * Mapping of available command shortcuts to commands
 */
const funcMap: KeyMap = {
  '\u001b': 'f.0', // Escape ^[   KingCount.fKey
  '\x1bOP': 'f.1', // F1 \u001bOP KingCount.fKey
  '\x1bOQ': 'f.2', // F2 \u001bOQ KingCount.fKey
  '\x1bOR': 'f.3', // F3 \u001bOR KingCount.fKey
  '\x1bOS': 'f.4', // F4 \u001bOS KingCount.fKey

  1 : 'list',        // KingCount.list
  2 : 'listDetail',  // KingCount.listDetail
  3 : '',
  4 : '',
  5 : '',
  6 : '',
  7 : '',
  8 : '',
  9 : '',
  0 : '',
  w : 'Conn.connect',     // KingConn.connect
  e : 'Conn.ping',        // KingConn.ping
  r : 'Conn.login',       // KingConn.login
  t : 'Conn.story',       // KingConn.story
  y : 'Conn.trades',      // KingConn.trades
  u : 'Conn.trade',       // KingConn.trade
  i : 'Conn.logout',      // KingConn logout
  o : 'Conn.close',       // KingConn close
  p : 'Conn.print',       // KingConn.print
  a : 'Conn.Socket.ping', // KingConn.Socket.ping
  z : 'Conn.Stream.ping', // KingConn.Stream.ping
}

/** print
 *
 * Display all the available command shortcuts
 */
function print (): void {
  for (const _ in funcMap) {
    console.info(JSON.stringify(_), funcMap[_])
  }
}

/** bind
 *
 * Recursive binding to connection properties via text string.
 *
 * Note: This impure function mogrifies the `props` argument.
 *
 * Hairflip: The use of `cprop.bind` is confusing to seem cool.
 *
 * @param c     - The object in question.
 * @param props - The property path to traverse.
 */
// deno-lint-ignore ban-types
function bind(c: any, props: string[]): Function | undefined {
  const prop = props.shift()
  if (prop) {
    const cprop = c[prop]
    Logger.info(`  BIND ${c.constructor.name}.${prop} = (${typeof cprop}) ${cprop?.name}`)
    if (cprop) {
      if (props.length === 0) {
        return typeof cprop === 'function' ? cprop.bind(c) : cprop
      }
      return bind(cprop, props)
    }
  }
}

/** getBinding
 *
 * Return the reference for the given function name.
 *
 * @param kingcount - Top-level object
 * @param input     - Dot-delimited property path, ex: Socket.ping
 */
// deno-lint-ignore ban-types
function getBinding(kingcount: KingCount, input: string): Function | undefined {
  const command: string = input in funcMap ? funcMap[input] : input
  Logger.info('* getBinding', typeof input, `(${input}) [${command}]`)
  if (command) {
    const func = bind(kingcount, command.split('.'))
    return func ? func : print
  }
}

export default {
  getBinding,
}
