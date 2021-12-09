import config from './config.ts'

console.log('config', config.accountId)

// wss://ws.xtb.com/demo
// wss://ws.xtb.com/demoStream
// wss://ws.xtb.com/real
// wss://ws.xtb.com/realStream
let socket: WebSocket

const url = 'wss://ws.xtb.com/' + config.type

enum Status {
  CONNECTING = 0,
  OPEN       = 1,
  CLOSING    = 2,
  CLOSED     = 3,
}

function connect() {
  console.log('Connecting with', url)
  socket = new WebSocket(url);
  socket.onopen = handleEvent
  socket.onclose = handleEvent
  socket.onmessage = (message: MessageEvent) => { console.log(message.data) }
  console.log('socket', socket)
}

function ping() {
  socket.send('{ "command": "ping" }');
}

function login() {
  const data = {
    command: 'login',
    arguments: {
      userId: config.accountId,
      password: config.password,
      appName: 'KingBot',
    }
  }
  socket.send(JSON.stringify(data));
}

function close() {
  if (socket?.readyState === Status.OPEN) {
    socket.close()
  }
  console.log(Status[socket && socket.readyState])
}

function handleEvent(event: any) {
  console.log(Status[socket && socket.readyState])
}

type KeyMap = {
  [key: string]: () => void
}

const cmdFunctions: KeyMap = {
  0 : () => console.log('All systems normal'),
  1 : connect,
  2 : ping,
  3 : login,
  4 : close,
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
  }
}

async function start() {
  for await (const command of getCommandFunction()) {
    command()
  }
  console.log()
}

export default {
  start,
}
