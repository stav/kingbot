// deno-lint-ignore-file no-explicit-any
import { Fetch } from 'lib/web.ts'

import type ForConn from './forex.ts'

export async function get (this: ForConn, url: string): Promise<any> {
  const headers = {
    UserName: this.account.username,
    Session: this.user.Session,
  }
  return await Fetch(this.base + url, { headers })
}

export async function post (this: ForConn, url: string, options: any = {}) {
  const method = options.method ?? 'POST'
  const headers = Object.assign({
    "Content-Type": 'application/json',
    UserName: this.account.username,
    Session: this.user.Session,
  }, options.headers ?? {})
  const request = new Request(url, { method, headers, body: options.body })
  return await Fetch(request)
}
