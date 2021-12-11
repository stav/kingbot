import Socket from './socket/mod.ts'

type KeyMap = {
  [key: string]: () => void
}

const cmdFunctions: KeyMap = {
  0 : Socket.print,
  1 : Socket.connect,
  2 : Socket.ping,
  3 : Socket.login,
  4 : Socket.trades,
  5 : Socket.logout,
  6 : Socket.close,
  7 : ()=>{},
  8 : ()=>{},
  9 : ()=>{},
}

function printCommands (): void {
  for (const _ in cmdFunctions) {
    console.log(JSON.stringify(_), cmdFunctions[_])
  }
}

async function* getInput (): AsyncGenerator<string, void, void> {
  let n

  while (n !== null) {
    const buf = new Uint8Array(1024);
    await Deno.stdout.write(new TextEncoder().encode('\n> '));
    n = <number>await Deno.stdin.read(buf);
    const input: string = new TextDecoder().decode(buf.subarray(0, n));
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
  console.log()
}

export default {
  start,
}
