import Commands from './commands.ts'
import getInput from './input.ts'
import KingConn from './conn.ts'

const kingconn = new KingConn()

async function start (): Promise<void> {
  for await (const input of getInput()) {
    const func = Commands.getFunction(kingconn, input)
    console.log('*', func)
    func()
  }
  console.info()
}

export default {
  start,
}
