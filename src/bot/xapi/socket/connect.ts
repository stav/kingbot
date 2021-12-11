import { KingResponse, XapiLoginResponse } from "./send.d.ts";
import { send, sync } from './send.ts'
import { isOpen } from './util.ts'
import KingSocket from './king.ts'
import config from './config.ts'
import url from './url.ts'

function newSocket(): KingSocket {
  console.info('Connecting with', url)
  return new KingSocket(url)
}

async function login(socket: KingSocket): Promise<void> {
  const data = {
    command: 'login',
    arguments: {
      userId: config.accountId,
      password: config.password,
      appName: 'KingBot',
    }
  }
  const response: KingResponse = await sync(data, socket)
  if (response.status) {
    socket.session = (<XapiLoginResponse>response).streamSessionId
  }
}

function logout(socket: KingSocket) {
  send({ command: 'logout' }, socket)
  socket.session = ''
}

function close(socket: KingSocket) {
  isOpen(socket) && socket.close()
  socket.print()
}

export default {
  newSocket,
  logout,
  login,
  close,
}
