import { TRADE_RECORD } from '../xapi.d.ts'
import { KingResponse, XapiDataResponse } from './king.d.ts'
import KingSocket from './king.ts'
import Connect from './connect.ts'

let socket: KingSocket

function _cmd (command: string): void {
  socket.sendx({ command })
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
  socket.print()
}

async function trades (): Promise<void> {
  const data = {
    command: 'getTrades',
    arguments: {
      openedOnly: false,
    }
  }
  const response: KingResponse = await socket.sync(data)
  if (response.status) {
    const trades: TRADE_RECORD[] = (<XapiDataResponse>response).returnData
    trades.sort((a: TRADE_RECORD, b: TRADE_RECORD) => a.open_time - b.open_time)
    console.info('trades', trades)
  }
  else {
    console.error('Trades', response)
  }
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
