import KingSocket from './king.ts'
import Connect from './connect.ts'

let socket: KingSocket

function connect () {
  if (!socket || !socket.isOpen) {
    socket = Connect.newSocket()
  }
}

function login () {
  connect()
  Connect.login(socket)
}

function logout () {
  if (socket?.session) {
    Connect.logout(socket)
  }
}

function close () {
  if (socket) {
    socket.isOpen && socket.close(1000)
    socket.print()
  }
}

function ping (): void {
  connect()
  socket.sendx({ command: 'ping' })
}

function print (): void {
  socket.print()
}

function trade (): void {
  connect()
  socket.trade()
}

function trades (): void {
  connect()
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
