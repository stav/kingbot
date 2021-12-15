// deno-lint-ignore-file no-explicit-any
import KingConn from './conn.ts'

type KeyMap = {
  [key: string]: string
}

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

function print (): void {
  for (const _ in funcMap) {
    console.info(JSON.stringify(_), funcMap[_])
  }
}

// deno-lint-ignore ban-types
function bind(c: any, props: string[]): Function | undefined {
  let cprop
  if (props.length > 0) {
    cprop = c[props[0]]
  }
  console.log('* bind', props, typeof cprop, cprop)
  if (cprop) {
    if (props.length === 1) {
      if (typeof cprop === 'function')
        return cprop.bind(c)
    }
    if (props.length === 2) {
      const prop = cprop[props[1]]
      if (typeof prop === 'function')
        return prop.bind(cprop)
    }
  }
}

// deno-lint-ignore ban-types
function getFunction(connection: KingConn, input: string): Function {
  const command: string = input in funcMap ? funcMap[input] : input
  console.log('* getFunction', typeof input, `(${input}) [${command}]`)
  if (!command) {
    return () => {}
  }
  const func = bind(connection, command.split('.'))
  return func ? func : print
}

export default {
  getFunction,
}
