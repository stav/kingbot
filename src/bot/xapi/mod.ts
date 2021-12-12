import Socket from './socket/mod.ts'

type KeyMap = {
  [key: string]: () => void
}

const cmdFunctions: KeyMap = {
  1 : Socket.connect,
  2 : Socket.ping,
  3 : Socket.login,
  4 : Socket.trades,
  5 : Socket.trade,
  6 : ()=>{},
  7 : ()=>{},
  8 : Socket.logout,
  9 : Socket.close,
  0 : Socket.print,
}

function printCommands (): void {
  for (const _ in cmdFunctions) {
    console.info(JSON.stringify(_), cmdFunctions[_])
  }
}

async function* getInput (): AsyncGenerator<string, void, void> {
  // https://github.com/dmitriytat/keypress/blob/master/mod.ts
  const prompt = new TextEncoder().encode('\n> ')
  const decoder = new TextDecoder()
  let n

  while (n !== null) {
    const buffer = new Uint8Array(1024)
    const reader = Deno.stdin.read(buffer)
    await Deno.stdout.write(prompt)
    n = <number>await reader
    const input: string = decoder.decode(buffer.subarray(0, n))
    yield input.trim()
  }
}

async function start (): Promise<void> {
  for await (const input of getInput()) {
    if (input)
      input in cmdFunctions
        ? cmdFunctions[input]()
        : printCommands()
  }
  console.info()
}

export default {
  start,
}
