import { KingResponse, XapiLoginResponse } from './king/mod.d.ts'
import KingSocket from './king/mod.ts'
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
  const response: KingResponse = await socket.sync(data)
  if (response.status) {
    socket.session = (<XapiLoginResponse>response).streamSessionId
  }
}

function logout(socket: KingSocket) {
  socket.session = ''
  socket.sendx({ command: 'logout' })
  socket.close(1000) // Server will close the connection as well
  socket.print()
}

export default {
  newSocket,
  logout,
  login,
}