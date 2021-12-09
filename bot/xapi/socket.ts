import config from './config.ts'

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

type InputData = {
  command: string
  arguments?: any
  prettyPrint?: boolean
}

function _isOpen(): boolean {
  return socket?.readyState === Status.OPEN
}

function _send(data: InputData): void {
  socket.send(JSON.stringify(data))
}

function _status(): string {
  return Status[socket?.readyState]
}

function status(): string {
  _send({ command: 'getVersion' })
  return `Socket ${socket.url} ${config.accountId} ${_status()}`
}

function connect(): void {
  console.log('Connecting with', url)
  socket = new WebSocket(url);
  socket.onopen = handleEvent
  socket.onclose = handleEvent
  socket.onmessage = (message: MessageEvent) => { console.log(message.data) }
}

function ping(): void {
  _isOpen() && _send({ command: 'ping' })
}

function login(): void {
  const data = {
    command: 'login',
    arguments: {
      userId: config.accountId,
      password: config.password,
      appName: 'KingBot',
    }
  }
  _isOpen() && _send(data)
}

function logout() {
  _isOpen() && _send({ command: 'logout' })
}

function close() {
  _isOpen() && socket.close()
  console.log(_status())
}

function handleEvent(event: any) {
  console.log(_status())
}

export default {
  connect,
  status,
  logout,
  login,
  close,
  ping,
}
