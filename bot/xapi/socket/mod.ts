import { InputData, TRADE_RECORD } from './socket.d.ts'
import { Status } from './const.ts'
import config from './config.ts'
import url from './url.ts'

let socket: WebSocket

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
  const customTag = Math.random().toString()
  const _data = Object.assign({ customTag }, data)
  let result: any

  function listener(event: MessageEvent) {
    const response = JSON.parse(event.data)
    if (response.customTag === customTag) {
      result = response.returnData
    }
  }
  socket.addEventListener('message', listener, { once: true })
  _send(_data)

  while (!result) {
    console.log('wait')
    await new Promise(res => setTimeout(res, 100))
  }

  return result
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
