import { Socket } from './xapi/mod.ts'

type KeyMap = {
  [key: string]: () => void
}

const funcMap: KeyMap = {
  1 : Socket.connect,
  2 : Socket.ping,
  3 : Socket.login,
  4 : Socket.status,
  5 : Socket.trades,
  6 : Socket.trade,
  7 : ()=>{},
  8 : Socket.logout,
  9 : Socket.close,
  0 : Socket.print,
}

function print (): void {
  for (const _ in funcMap) {
    console.info(JSON.stringify(_), funcMap[_])
  }
}

export default {
  funcMap,
  print,
}
