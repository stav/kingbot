import Socket from './socket/mod.ts'

function print() {
  console.log(Socket.status())
}

export default {
  print,
}
