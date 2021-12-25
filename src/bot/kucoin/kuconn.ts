import { encode as b64encode } from 'https://deno.land/std/encoding/base64.ts'

import type { ConfigAccount } from '../config.d.ts'
import type { KingConn } from '../conn.d.ts'

type ApiKeyData = {
  key: string
  secret: string
  passphrase: string
}

async function sign (data: string, secret: string) {
  // https://stackoverflow.com/questions/65805172#answer-65807243
  const encoder = new TextEncoder()

  const key: CryptoKey = await crypto.subtle.importKey(
                                'raw', //      format: "raw" | "pkcs8" | "spki"
               encoder.encode(secret), //     keyData: BufferSource
    { name: 'HMAC', hash: 'SHA-256' }, //   algorithm: AlgorithmIdentifier
                               false , // extractable: boolean
                             ['sign'], //   keyUsages: KeyUsage[]
  )
  const encodedData: Uint8Array = encoder.encode(data)
  const signed: ArrayBuffer = await crypto.subtle.sign('HMAC', key , encodedData.buffer)
  const signature = b64encode(new Uint8Array(signed))

  return signature
}

export default class KuConn implements KingConn {

  base = 'https://api.kucoin.com'
  account

  constructor (account: ConfigAccount) {
    this.account = account
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
    const returnData = {
      'KC-API-KEY': api.key,
      'KC-API-SIGN': await sign(document, api.secret),
      'KC-API-TIMESTAMP': timestamp.toString(),
      'KC-API-PASSPHRASE': await sign(api.passphrase, api.secret),
      'KC-API-KEY-VERSION': '2',
    }
    return returnData
  }

  private async resolvePrivate (relativePath: string, options?: RequestInit) {
    const path = '/api/v1/' + relativePath
    const url = this.base + path
    const method = options?.method || 'GET'

    const akd: ApiKeyData = {
      key: '61c40160d98e2200014f3535',
      secret: '090c76fd-0d75-4ee0-a63d-e6c607bd6819',
      passphrase: 'wehavereceivedyourinquiry',
    }
    const authHeaders = await this.auth(akd, method, path)
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

  async user () {
    console.log('accounts', await this.resolvePrivate('accounts'))
    console.log('sub/user', await this.resolvePrivate('sub/user'))
  }

  async connect () {
  }

  async time () {
    const time = await this.resolvePublic('timestamp')
    console.log('time', time, new Date(time))
  }

  list (index: number) {
    console.log('CNX', index, this.constructor.name, this.account.name)
  }

}
