import Commands from './cmd.ts'
import getInput from './input.ts'
import KingCount from './count.ts'

const kingcount = new KingCount()

async function start (): Promise<void> {
  for await (const input of getInput(kingcount)) {
    const obj = Commands.getBinding(kingcount, input)
    console.info(typeof obj, obj)
    if (typeof obj === 'function')
      obj()
  }
}

export default {
  start,
}
