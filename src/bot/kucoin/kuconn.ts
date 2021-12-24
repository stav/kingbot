import { crypto } from 'https://deno.land/std@0.119.0/crypto/mod.ts'

import type { ConfigAccount } from '../config.d.ts'
import type { KingConn } from '../conn.d.ts'

type ApiKeyData = {
  key: string
  secret: string
  passphrase: string
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

  async auth(ApiKey: ApiKeyData, method: string, url: string, body = '') {
    async function sign(data: string, secret: string) {
      const key = await genKey(secret)
      console.log('auth.sign', data, `(${secret})`, key)
      const jwt = await getJWT(key, data)
      return jwt
    }
    const timestamp = Date.now()
    const document = timestamp + method.toUpperCase() + url + body
    console.log('auth.document', document)
    const returnData = {
      'KC-API-KEY': ApiKey.key,
      'KC-API-SIGN': await sign(document, ApiKey.secret),
      'KC-API-TIMESTAMP': timestamp.toString(),
      // 'KC-API-PASSPHRASE': await sign(ApiKey.passphrase, ApiKey.secret),
      'KC-API-PASSPHRASE': ApiKey.passphrase,
      'KC-API-KEY-VERSION': '2',
    }
    return returnData
  }

  private async resolvePrivate (relativePath: string) {
    const url = this.base + '/api/v1/' + relativePath

    const akd: ApiKeyData = {
      key: '61c40160d98e2200014f3535',
      secret: '090c76fd-0d75-4ee0-a63d-e6c607bd6819',
      passphrase: 'wehavereceivedyourinquiry',
    }
    const authHeaders = await this.auth(akd, 'GET', url)
    const saltHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'Kingbot/2',
    }
    const headers = Object.assign(saltHeaders, authHeaders)
    console.log('resolve.headers', headers)
    const response = await fetch(url, { headers })
    return response.ok
      ? (await response.json()).data
      : response
  }

  async user () {
    const path = 'sub/user'
    const user = await this.resolvePrivate(path)
    console.log('user', user)
  }

  async connect () {
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

  async sign () {
    // https://medium.com/deno-the-complete-reference/sign-verify-jwt-hmac-sha256-4aa72b27042a
    const data = { exp: Date.now(), a: 'b', c: 'd', e: 100 }
    const key = await genKey("013d3270-b0a0-46f8-9e56-2265ba768e12")
    const jwt = await getJWT(key, data)
    const result = await checkJWT(key, jwt)
    console.log('sign0')
    console.log('sign1', data)
    console.log('sign2', result)
    console.log('sign3', result == data)
    //jwt: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MzAyNTc4NzY1MTMsImEiOiJiIiwiYyI6ImQiLCJlIjoxMDB9.2EFOA5-sa_taJEEVDaP_xKSA-Nv5IqQYj_-MhmpG1J8const data=await checkJWT(key, jwt);
    //data: { exp: 1630257876513, a: "b", c: "d", e: 100 }
  }

  async time () {
    const time = await this.resolvePublic('timestamp')
    console.log('time', time, new Date(time))
  }

  list (index: number) {
    console.log('CNX', index, this.constructor.name, this.account.name)
  }

}

import {encode as bEnc, decode as bDec} from "https://deno.land/std/encoding/base64url.ts"
import { encode, decode } from "https://deno.land/std/encoding/base64url.ts"
import { HmacSha256 } from "https://deno.land/std/hash/sha256.ts"

const tEnc = (d:string) => new TextEncoder().encode(d)
const tDec = (d:Uint8Array) => new TextDecoder().decode(d)

type HmacImportParams = { name: 'HMAC', hash: 'SHA-256' | 'SHA-384' | 'SHA-512' }
const params: HmacImportParams = { name:"HMAC", hash:"SHA-256" }
const genKey = async (k:string) => await crypto.subtle.importKey!("raw", tEnc(k), params, false, ["sign", "verify"]) as CryptoKey

const getJWT = async (key:CryptoKey, data:any) => {
  const payload = bEnc(tEnc(JSON.stringify({alg:"HS256", typ:"JWT"})))+'.'+bEnc(tEnc(JSON.stringify(data)))
  const signed = await crypto.subtle.sign!({name:"HMAC"}, key, tEnc(payload)) as ArrayBuffer
  const signature = bEnc(new Uint8Array(signed))
  return `${payload}.${signature}`
}
const checkJWT = async (key:CryptoKey, jwt:string) => {
  const jwtParts = jwt.split(".")
  if (jwtParts.length !== 3) return
  const data = tEnc(jwtParts[0]+'.'+jwtParts[1])
  if (await crypto.subtle.verify!({ name:"HMAC" }, key, bDec(jwtParts[2]), data)===true)
    return JSON.parse(tDec(bDec(jwtParts[1])))
}

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
