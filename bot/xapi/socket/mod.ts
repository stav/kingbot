import { TRADE_RECORD } from './socket.d.ts'
import { send, sync } from './send.ts'
import { cprint } from './util.ts'
import Connect from './connect.ts'

let socket: WebSocket

function _cmd (command: string): void {
  send({ command }, socket)
}

function connect () {
  socket = Connect.newSocket()
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

function print (): void {
  _cmd('getVersion') // TODO relying on console log of message as side effect
  cprint.call(socket)
}

async function trades (): Promise<TRADE_RECORD[]> {
  const data = {
    command: 'getTrades',
    arguments: {
      openedOnly: false,
    }
  }
  const trades: TRADE_RECORD[] = await sync(data, socket)
  console.log('trades', trades)
  return trades.sort((a: TRADE_RECORD, b: TRADE_RECORD) => a.open_time - b.open_time)
}

export default {
  ping,
  close,
  login,
  print,
  logout,
  trades,
  connect,
}
