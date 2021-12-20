import { KingCat } from '../xapi.ts'

export default class KingStream extends KingCat {

  // deno-lint-ignore no-explicit-any
  constructor (account: any) {
    super(account)
  }

  ping () {
    // this.sendx({ command: 'ping' })
  }

  close () {
    if (this.socket) {
      this.isOpen && this.socket.close(1000)
      this.print()
    }
  }

}
