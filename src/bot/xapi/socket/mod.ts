import KingSocket from './king/mod.ts' // XXX TODO Circular reference
import Connect from './connect.ts'

/**
* @note
* Certain functions operate on open sockets only. A call to `connect` requests
* a connection to the server and returns. The connection message arrives to the
* listener at some point in the future. In order to properly implement these
* functions (login, ping, etc) which may call `connect`, we need to create a
* queue.
*/

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

function status () {
  socket && socket.status()
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
  socket && socket.print()
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
  status,
  connect,
}
