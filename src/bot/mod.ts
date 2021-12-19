import Commands from './commands.ts'
import getInput from './input.ts'
import KingCount from './count.ts'

const kingcount = new KingCount()

async function start (): Promise<void> {
  for await (const input of getInput(kingcount)) {
    const obj = Commands.getBinding(kingcount, input)
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
