import { crypto } from "https://deno.land/std@0.119.0/crypto/mod.ts";

import type { ConfigAccount } from '../config.d.ts'
import type { KingConn } from '../conn.d.ts'

export default class KuConn implements KingConn {

  base = 'https://api.kucoin.com'
  account

  constructor (account: ConfigAccount) {
    this.account = account
  }

  private async resolve (relativePath: string) {
    const url = this.base + '/api/v1/' + relativePath
    const response = await fetch(url)
    return response.ok
      ? (await response.json()).data
      : response
  }

  connect () {
    // C-API-KEY 61c40160d98e2200014f3535
    // KC-API-SIGN The base64-encoded signature (see Signing a Message).
    // KC-API-TIMESTAMP Date.now()
    // KC-API-PASSPHRASE wehavereceivedyourinquiry
    // KC-API-KEY-VERSION v2

    const api = {
      key: '61c40160d98e2200014f3535',
      secret: '090c76fd-0d75-4ee0-a63d-e6c607bd6819',
      passphrase: 'wehavereceivedyourinquiry',
    }
    const x = auth(api, 'GET', 'http://localhost', 'asdf')
    console.log('auth', x)
  }

  jwt () {
    // https://medium.com/deno-the-complete-reference/using-jwt-json-web-token-in-deno-9d0c0346982f#a549
    const hdr = { alg:'HS256', typ: 'JWT' }
    const date = Date.now() + 24 * 60 * 60 * 1000
    const data = { exp: date, a: 'b', c: 'd', e: 100 }
    console.log('data', data)
    const secret = 'ryweuftioovqiuhmhxwrunkfvsorniygwuiwrfamjhrycvuyikgjugbomnjupxucnskhjbuthxjabjsr'
    const tknIn = createJWT(hdr, data, secret)
    console.log('tknIn', tknIn)
    const tknOut = verifyJWT(tknIn, secret)
    console.log('tknOut', tknOut)
  }

  async time () {
    const time = await this.resolve('timestamp')
    console.log('time', time, new Date(time))
  }

  list (index: number) {
    console.log('CNX', index, this.constructor.name, this.account.name)
  }

}

import { encode, decode } from "https://deno.land/std/encoding/base64url.ts"
import { HmacSha256 } from "https://deno.land/std/hash/sha256.ts"

function createJWT(header:any, payload:any, secret:string): string {
  const bHdr = encode(new TextEncoder().encode(JSON.stringify(header)))
  const bPyld = encode(new TextEncoder().encode(JSON.stringify(payload)))
  const oTkn = `${bHdr}.${bPyld}`
  return oTkn + '.' + (new HmacSha256(secret)).update(oTkn).toString()
}

function verifyJWT(token:string, secret:string) {
  const parts = token.split('.')
  console.log('parts', parts)
  if (parts.length !== 3) return

  const calcSign = (new HmacSha256(secret)).update(`${parts[0]}.${parts[1]}`).toString()
  console.log('calcSign', calcSign)
  if (calcSign !== parts[2]) return

  const pyld = JSON.parse(new TextDecoder().decode(decode(parts[1])))
  const date = Date.now()
  console.log('pyld', pyld, date, date - pyld.exp)
  if (pyld.exp && date>pyld.exp) return

  console.log('payday!')
  return pyld
}

function sign(text: any, secret: any, outputType = 'base64') {
  const result = crypto.subtle.digestSync(
    'SHA-256',
    new TextEncoder().encode(text)
  )
  console.log('sign', text, result)
  return result
  // .createHmac('sha256', secret)
  // .update(text)
  // .digest(outputType);
}

function auth(ApiKey: any, method: string, url: string, data: string) {
  const timestamp = Date.now();
  const signature = sign(timestamp + method.toUpperCase() + url + data, ApiKey.secret);
  const returnData = {
    'KC-API-KEY': ApiKey.key,
    'KC-API-SIGN': signature,
    'KC-API-TIMESTAMP': timestamp.toString(),
    'KC-API-PASSPHRASE': sign(ApiKey.passphrase || '', ApiKey.secret),
    'KC-API-KEY-VERSION': 2,
    'Content-Type': 'application/json',
    'User-Agent': `Kingbot/2`,
  }
  return returnData
}
