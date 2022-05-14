import Logging from 'lib/logging.ts'

import getInput from './input.ts'
import KingCount from './count.ts'

async function start (): Promise<void> {

  const kingcount = new KingCount()

  for await (const input of getInput(kingcount)) {

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
  kingcount.close()
}

export default {
  start,
}
