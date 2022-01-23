import getInput from './input.ts'
import KingCount from './count.ts'

const kingcount = new KingCount()

async function start (): Promise<void> {
  for await (const input of getInput(kingcount)) {

    // Bind it
    const obj = kingcount.bind(input)

    // Print it
    console.info(`input "${input}" (${typeof obj})`, obj)

    // Call it
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
