import Logging from 'lib/logging.ts'

import getInput from './input.ts'
import KingCount from './count.ts'

const kingcount = new KingCount()

async function start (): Promise<void> {
  for await (const input of getInput(kingcount)) {

    // Prime it
    kingcount.prime() // This laziness is only here because I don't know if we're in a test

    // Bind it
    const obj = kingcount.bind(input)

    // Print it
    console.info(`input "${input}" (${typeof obj}) '${obj?.constructor.name}'`, obj)

    // Call it
    if (typeof obj === 'function')
      console.info(await obj()) // Is it ok to await if it's not a promise?

    // Flush it
    Logging.flush()

  }
}

export default {
  start,
}
