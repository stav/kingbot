import type KuConn from './kuconn.ts'
import sign from './sign.ts'

type ApiKeyData = {
  key: string
  secret: string
  passphrase: string
}

async function auth(api: ApiKeyData, method: string, url: string, body = '') {
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

export async function resolvePrivate (this: KuConn, relativePath: string, options?: RequestInit) {
  const path = '/api/v1/' + relativePath
  const url = this.base + path
  const creds = this.account.api
  const method = options?.method || 'GET'
  const authHeaders = await auth(creds, method, path)
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

export async function resolvePublic (this: KuConn, relativePath: string, options?: RequestInit) {
  const url = this.base + '/api/v1/' + relativePath
  const response = await fetch(url, options)
  return response.ok
    ? (await response.json()).data
    : response
}
