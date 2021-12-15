import Commands from './commands.ts'
import getInput from './input.ts'
import KingConn from './conn.ts'

const kingconn = new KingConn()

async function start (): Promise<void> {
  for await (const input of getInput()) {
    const obj = Commands.getBinding(kingconn, input)
    if (obj) {
      console.info(obj)
      if (typeof obj === 'function')
        obj()
    }
    else {
      console.info()
    }
  }
}

export default {
  start,
}
