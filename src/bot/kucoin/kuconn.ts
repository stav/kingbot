import type { KucoinConfigAccount } from '../config.d.ts'
import type { KingConn } from '../conn.d.ts'
import Socket from '../socket.ts'
import { resolvePrivate, resolvePublic } from './resolve.ts'

export default class KuConn extends Socket implements KingConn {

  #tickToggle = false

  base = 'https://api.kucoin.com'
  // base = 'https://openapi-sandbox.kucoin.com'
  session = ''
  account: KucoinConfigAccount
  // tickPrice = ''
  // tickTime = 0

  resolvePublic = resolvePublic
  resolvePrivate = resolvePrivate

  constructor (account: KucoinConfigAccount) {
    super()
    this.account = account
  }

  private get scribe () {
    return this.#tickToggle ? 'unsubscribe' : 'subscribe'
  }

  list (index: number) {
    console.log('CNX', index, this.constructor.name, this.account.name)
  }

  async user () {
    console.log('accounts', await this.resolvePrivate('accounts'))
    console.log('sub/user', await this.resolvePrivate('sub/user'))
  }

  async orders () {
    console.log('orders (done)', await this.resolvePrivate('orders?status=done'))
    console.log('orders (active)', await this.resolvePrivate('orders?status=active'))
  }

  async fees () {
    console.log('fee (base)', await this.resolvePrivate('base-fee'))
    console.log('fee (trade)', await this.resolvePrivate('trade-fees?symbols=BTC-USDT,KCS-USDT'))
  }

  async symbols () {
    console.log('symbols', await this.resolvePublic('symbols'))
  }

  async book () {
    console.log('symbols', await this.resolvePublic('market/orderbook/level2_20?symbol=BTC-USDT'))
  }

  async time () {
    const time = await this.resolvePublic('timestamp')
    console.log('time', time, new Date(time))
  }

  ticks () {
    console.log('ticks', this.scribe)
    const data = {
      id: this.session,                          // The id should be an unique value
      type: this.scribe,                         // "subscribe" | "unsubscribe"
   // topic: "/market/ticker:BTC-USDT,ETH-USDT", // Topic needs to be subscribed. Some topics support to divisional subscribe the informations of multiple trading pairs through ",".
      topic: "/market/ticker:BTC-USDT",          // Topic needs to be subscribed. Some topics support to divisional subscribe the informations of multiple trading pairs through ",".
      privateChannel: false,                     // Adopted the private channel or not. Set as false by default.
      response: true                             // Whether the server needs to return the receipt information of this subscription or not. Set as false by default.
    }
    if (this.isOpen) {
      this.socket?.send(JSON.stringify(data))
      this.#tickToggle = !this.#tickToggle
    }
  }

  async status () {
    console.log('time', await this.resolvePublic('status'))
  }

  protected gotOpen (_event: Event) {
    console.log('open')
  }

  protected gotClose (event: CloseEvent): void {
    console.log('Socket closed with code', event.code)
  }

  protected gotError (e: Event | ErrorEvent): void {
    console.error((<ErrorEvent>e).message)
  }

  protected gotMessage (message: MessageEvent): void {
    const data = JSON.parse(message.data)
    if (data.type === 'welcome') {
      // message.data: '{"id":"U25Is3tfF2","type":"welcome"}',
      this.session = data.id
      console.log(data)
    }
    else if (data.type === 'message' && data.subject === 'trade.ticker') {
      // message.data: '{
      //   "bestAsk": "4077.52",
      //   "bestAskSize": "0.2",
      //   "bestBid": "4077.51",
      //   "bestBidSize": "10.5895537",
      //   "price": "4077.13",
      //   "sequence": "1622098307395",
      //   "size": "0.0007592",
      //   "time": 1640573682498
      // }'
      const t = data.data
      // if (this.tickTime + 1000 < t.time) {
      //   console.log(this.tickTime, t.time)
      //   this.tickPrice = t.price
      //   this.tickTime = t.time
      // }
      const encoder = new TextEncoder()
      Deno.stdout.writeSync(encoder.encode(new Date(t.time).toString()))
      // Deno.stdout.writeSync(encoder.encode('      |      '))
      // Deno.stdout.writeSync(encoder.encode(this.tickPrice ))
      Deno.stdout.writeSync(encoder.encode('      |      '))
      Deno.stdout.writeSync(encoder.encode(t.price))
      Deno.stdout.writeSync(encoder.encode('           \r'))
    }
  }

  async connect () {
    const feed = await this.resolvePublic('bullet-public', { method: 'POST' })
    const endpoint = feed.instanceServers[0].endpoint
    const url = `${endpoint}?token=${feed.token}`
    console.info(url)
    this.socket = new WebSocket(url)
    this.socket.onopen = this.gotOpen.bind(this)
    this.socket.onclose = this.gotClose.bind(this)
    this.socket.onerror = this.gotError.bind(this)
    this.socket.onmessage = this.gotMessage.bind(this)
  }

  close () {
    if (this.isOpen)
      this.socket?.close()
  }

}
