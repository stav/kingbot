
const ports = {
  demo: {
    main: 5124,
    stream: 5125,
  },
  real: {
    main: 5112,
    stream: 5113,
  },
}

// wss://ws.xtb.com/demo
// wss://ws.xtb.com/demoStream
// wss://ws.xtb.com/real
// wss://ws.xtb.com/realStream
const host = 'ws.xtb.com'
const type = 'demo'
// const port = ports[type].main
// const url = `wss://${host}:${port}/${type}`
const url = `wss://${host}/${type}`
let socket: WebSocket

function connect() {
  console.log('Connecting with', url)
  socket = new WebSocket(url);
  // socket.addEventListener('open', function (event: any) {
  //   console.log('open', event)
  //   socket.send('{ "command": "ping" }');
  // });
  // socket.addEventListener('message', function (event: any) {
  //   console.log('Message from server ', event.data);
  // });
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
  2 : close,
  3 : ping,
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
