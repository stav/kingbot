import getInput from './input.ts'
import KingCount from './count.ts'

const kingcount = new KingCount()

async function start (): Promise<void> {
  for await (const input of getInput(kingcount)) {
    const obj = kingcount.bind(input)
    console.info(`input "${input}"`, typeof obj, obj)
    if (typeof obj === 'function')
      console.info(
        obj.constructor.name === 'AsyncFunction'
          ? await obj()
          : obj()
      )
  }
}

export default {
  start,
}
