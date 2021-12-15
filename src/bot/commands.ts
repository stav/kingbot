// deno-lint-ignore-file no-explicit-any
import Logger from "../log.ts"
import KingConn from './conn.ts'

type KeyMap = {
  [key: string]: string
}

/** funcMap
 *
 * Mapping of available command shortcuts to commands
 */
const funcMap: KeyMap = {
  1 : 'connect',     // KingConn.connect
  2 : 'ping',        // KingConn.ping
  3 : 'login',       // KingConn.login
  4 : 'story',       // KingConn.story
  5 : 'trades',      // KingConn.trades
  6 : 'trade',       // KingConn.trade
  7 : '',
  8 : 'logout',      // KingConn logout
  9 : 'close',       // KingConn close
  0 : 'print',       // KingConn.print
  a : 'Socket.ping', // KingConn.Socket.ping
}

/**print
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
 * @param c     - The object in question.
 * @param props - The property path to traverse.
 */
// deno-lint-ignore ban-types
function bind(c: any, props: string[]): Function | undefined {
  const prop = props.shift()
  if (prop) {
    const cprop = c[prop]
    Logger.info('* bind', props, typeof cprop, cprop)
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
 * @param connection - Top-level object
 * @param input      - Dot-delimited property path, ex: Socket.ping
 */
// deno-lint-ignore ban-types
function getBinding(connection: KingConn, input: string): Function | undefined {
  const command: string = input in funcMap ? funcMap[input] : input
  Logger.info('* getBinding', typeof input, `(${input}) [${command}]`)
  if (command) {
    const func = bind(connection, command.split('.'))
    return func ? func : print
  }
}

export default {
  getBinding,
}
