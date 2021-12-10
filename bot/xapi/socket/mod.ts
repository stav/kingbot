import { status as _status } from './util.ts'
import { TRADE_RECORD } from './socket.d.ts'
import { send, sync } from './send.ts'
import Connect from './connect.ts'
import config from './config.ts'

let socket: WebSocket

function _cmd (command: string): void {
  send({ command }, socket)
}

function connect () {
  socket = Connect.get()
}

function login () {
  Connect.login(socket)
}

function logout () {
  Connect.logout(socket)
}

function close () {
  Connect.close(socket)
}

function ping (): void {
  _cmd('ping')
}

function status (): string {
  _cmd('getVersion')
  const id = config.accountId
  const url = socket.url
  const status = _status(socket)
  return `Socket ${url} ${id} ${status}`
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

export default {
  ping,
  close,
  login,
  logout,
  status,
  trades,
  connect,
}
