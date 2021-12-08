
type KeyMap = {
  [key: string]: () => void
}

const cmdFunctions: KeyMap = {
  0 : () => console.log('All systems normal'),
}

function printCommands(): void {
  for (const _ in cmdFunctions) {
    const func = cmdFunctions[_]
    console.log(JSON.stringify(_), func)
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

async function* getCommandFunction (): AsyncGenerator<()=>void, void, void> {
  for await (const input of getInput()) {
    yield input in cmdFunctions ? cmdFunctions[ input ] : printCommands
  }
}

export default async function KingBot() {
  for await (const command of getCommandFunction()) {
    command()
  }
}
