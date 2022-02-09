import type { Packet } from "https://deno.land/x/wocket@v0.6.3/mod.ts"
import { Server } from "https://deno.land/x/wocket@v0.6.3/mod.ts"

import Logger from '../../log.ts'

import type { KingConn } from '../conn.d.ts'

export default class TConn implements KingConn {

  #connected = false
  #hostname = '127.0.0.1'
  #port = 1778
  private readonly server: Server

  constructor () {
    this.server = new Server()
  }

  private get state () {
    return (this.#connected)
      ? 'Connected'
      : '-Disconnected'
  }

  #create () {
    this.server.on("connect", (packet: Packet) => {
      Logger.info('Websocket client connected with id', packet.from.id)
    })
    this.server.on("Telegram", (packet: Packet) => {
      Logger.info('Websocket client Telegram with id', packet.from.id, packet.message)
    })
  }

  #run () {
    this.server.run({
      hostname: this.#hostname,
      port: this.#port,
    })
  }

  prompt () {
    return this.state.charAt(0)
  }

  list (index: number) {
    const _index = isNaN(index) ? '' : index
    return `CNX ${_index} [${this.prompt()}] ${this.constructor.name}`
  }

  connect () {
    this.#run()
    this.#create()
    this.#connected = true
    return this.server
  }

  close () {
    this.server.close()
    this.#connected = false
  }

}
