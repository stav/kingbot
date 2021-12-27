import { encode as b64encode } from 'https://deno.land/std/encoding/base64.ts'

import type { ConfigAccount } from '../config.d.ts'
import type { KingConn } from '../conn.d.ts'
import Socket from '../socket.ts'

type ApiKeyData = {
  key: string
  secret: string
  passphrase: string
}

async function importKey (secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
                                'raw', //      format: "raw" | "pkcs8" | "spki"
     new TextEncoder().encode(secret), //     keyData: BufferSource
    { name: 'HMAC', hash: 'SHA-256' }, //   algorithm: AlgorithmIdentifier
                               false , // extractable: boolean
                             ['sign'], //   keyUsages: KeyUsage[ sign, verify ]
  )
}

async function sign (data: string, secret: string): Promise<string> {
  // https://stackoverflow.com/questions/65805172#answer-65807243
  const key: CryptoKey = await importKey(secret)
  const encodedData = new TextEncoder().encode(data).buffer
  const signedData = await crypto.subtle.sign('HMAC', key , encodedData)
  const signature = b64encode(new Uint8Array(signedData))
  return signature
}

export default class KuConn extends Socket implements KingConn {

  base = 'https://api.kucoin.com'
  session = ''
  account
  tickToggle = false
  // tickPrice = ''
  // tickTime = 0

  constructor (account: ConfigAccount) {
    super()
    this.account = Object.assign({ api: {} as ApiKeyData }, account)
  }

  private async resolvePublic (relativePath: string, options?: RequestInit) {
    const url = this.base + '/api/v1/' + relativePath
    const response = await fetch(url, options)
    return response.ok
      ? (await response.json()).data
      : response
  }

  async auth(api: ApiKeyData, method: string, url: string, body = '') {
    const timestamp = Date.now()
    const document = timestamp + method.toUpperCase() + url + body
    return {
      'KC-API-KEY': api.key,
      'KC-API-SIGN': await sign(document, api.secret),
      'KC-API-TIMESTAMP': timestamp.toString(),
      'KC-API-PASSPHRASE': await sign(api.passphrase, api.secret),
      'KC-API-KEY-VERSION': '2',
    }
  }

  private async resolvePrivate (relativePath: string, options?: RequestInit) {
    const path = '/api/v1/' + relativePath
    const url = this.base + path
    const creds = this.account.api
    const method = options?.method || 'GET'
    const authHeaders = await this.auth(creds, method, path)
    const saltHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'Kingbot/2',
    }
    const headers = Object.assign(saltHeaders, authHeaders)
    const _options = Object.assign({ method, headers }, options)
    const response = await fetch(url, _options)
    return response.ok
      ? (await response.json()).data
      : response
  }

  list (index: number) {
    console.log('CNX', index, this.constructor.name, this.account.name)
  }

  async user () {
    console.log('accounts', await this.resolvePrivate('accounts'))
    console.log('sub/user', await this.resolvePrivate('sub/user'))
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
    this.tickToggle = !this.tickToggle
    const scribe = this.tickToggle ? 'subscribe' : 'unsubscribe'
    console.log('ticks', scribe)
    const data = {
      id: this.session,                          // The id should be an unique value
      type: scribe,                              // "subscribe" | "unsubscribe"
   // topic: "/market/ticker:BTC-USDT,ETH-USDT", // Topic needs to be subscribed. Some topics support to divisional subscribe the informations of multiple trading pairs through ",".
      topic: "/market/ticker:BTC-USDT",          // Topic needs to be subscribed. Some topics support to divisional subscribe the informations of multiple trading pairs through ",".
      privateChannel: false,                     // Adopted the private channel or not. Set as false by default.
      response: true                             // Whether the server needs to return the receipt information of this subscription or not. Set as false by default.
    }
    if (this.isOpen)
      this.socket?.send(JSON.stringify(data))
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
