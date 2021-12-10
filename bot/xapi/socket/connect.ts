import { isOpen, status } from './util.ts'
import { send } from './send.ts'
import config from './config.ts'
import url from './url.ts'

function get(): WebSocket {
  console.log('Connecting with', url)
  const socket = new WebSocket(url);
  socket.onopen = () => console.log(status(socket))
  socket.onclose = () => console.log(status(socket))
  socket.onmessage = (message: MessageEvent) => { console.log(message.data) }
  return socket
}

function login(socket: WebSocket): void {
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

function logout(socket: WebSocket) {
  send({ command: 'logout' }, socket)
}

function close(socket: WebSocket) {
  isOpen(socket) && socket.close()
  console.log(status(socket))
}

export default {
  logout,
  login,
  close,
  get,
}
