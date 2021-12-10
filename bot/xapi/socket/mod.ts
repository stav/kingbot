import { TRADE_RECORD } from './socket.d.ts'
import { Status } from './const.ts'
import config from './config.ts'
import url from './url.ts'
import { send, sync } from './send.ts'

let socket: WebSocket

function _isOpen(): boolean {
  return socket?.readyState === Status.OPEN
}

function _status(): string {
  return Status[socket?.readyState]
}

function status(): string {
  send({ command: 'getVersion' }, socket)
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
  send({ command: 'ping' }, socket)
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
  send(data, socket)
}

async function trades (): Promise<TRADE_RECORD[]> {
  const data = {
    command: 'getTrades',
    arguments: {
      openedOnly: false,
    }
  }
  const trades = await sync(data, socket)
  console.log('trades', trades)
  return trades.sort((a: TRADE_RECORD, b: TRADE_RECORD) => a.open_time - b.open_time)
}

function logout() {
  send({ command: 'logout' }, socket)
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
