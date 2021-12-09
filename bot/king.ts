
// wss://ws.xtb.com/demo
// wss://ws.xtb.com/demoStream
// wss://ws.xtb.com/real
// wss://ws.xtb.com/realStream
let socket: WebSocket
const url = 'wss://ws.xtb.com/demo'

function connect() {
  console.log('Connecting with', url)
  socket = new WebSocket(url);
  socket.onopen = console.log
  socket.onclose = console.log
  socket.onmessage = (message: any) => {
    console.log(message.data)
  }
  console.log('socket', socket)
}

function ping() {
  socket.send('{ "command": "ping" }');
}

function login() {
  const data = {
    command: "login",
    arguments: {
      userId: "1000",
      password: "PASSWORD",
      appId: "test",
      appName: "test",
    }
  }
  socket.send(JSON.stringify(data));
}

function close() {
  console.log('Closing')
  socket.close()
}

type KeyMap = {
  [key: string]: () => void
}

const cmdFunctions: KeyMap = {
  0 : () => console.log('All systems normal'),
  1 : connect,
  3 : ping,
  2 : close,
  4 : login,
  5 : ()=>{},
  6 : ()=>{},
  7 : ()=>{},
  8 : ()=>{},
  9 : ()=>{},
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
    if (input) yield input in cmdFunctions ? cmdFunctions[ input ] : printCommands
    else console.log()
  }
}

export default async function KingBot() {
  for await (const command of getCommandFunction()) {
    command()
  }
}
