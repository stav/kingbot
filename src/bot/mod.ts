import Commands from './commands.ts'
import getInput from './input.ts'

const fMap = Commands.funcMap

async function start (): Promise<void> {
  for await (const input of getInput()) {
    if (input)
      input in fMap
        ? fMap[input]()
        : Commands.print()
  }
  console.info()
}

export default {
  start,
}
