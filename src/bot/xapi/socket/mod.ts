import KingSocket from './king.ts'
import Connect from './connect.ts'

let socket: KingSocket

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
  socket.sendx({ command: 'ping' })
}

function print (): void {
  socket.print()
}

function trade (): void {
  socket.trade()
}

function trades (): void {
  socket.trades()
}

export default {
  ping,
  close,
  login,
  print,
  trade,
  trades,
  logout,
  connect,
}
