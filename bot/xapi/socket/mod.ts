import config from './config.ts'
import { TRADE_RECORD } from "./socket.d.ts";

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
  customTag?: string
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

async function _sync (data: InputData): Promise<any[]> {
  const _data = Object.assign({ customTag: 'randomy' }, data)
  console.log('data', _data)
  const options = { once: true }
  let result: any

  function listener(event: MessageEvent) {
    result = JSON.parse(event.data)
  }
  socket.addEventListener('message', listener, options)
  _send(_data)

  while (!result) {
    console.log('not yet')
    await new Promise(res => setTimeout(res, 100))
    console.log(' yet')
  }
  console.log('result', result)

  return result.returnData
}

async function trades (): Promise<TRADE_RECORD[]> {
  const data = {
    command: 'getTrades',
    arguments: {
      openedOnly: false,
    }
  }
  const trades = await _sync(data)
  console.log('trades', trades)
  return trades.sort((a: TRADE_RECORD, b: TRADE_RECORD) => a.open_time - b.open_time)
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
  trades,
  logout,
  login,
  close,
  ping,
}
