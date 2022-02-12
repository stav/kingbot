import type { Context } from 'https://deno.land/x/oak/mod.ts'
import { Application, Router } from 'https://deno.land/x/oak/mod.ts'
import * as yup from 'https://cdn.skypack.dev/yup'
// import typesYup from 'https://cdn.skypack.dev/@types/yup'

import Logger from '../../log.ts'

interface RequestError extends Error {
  status: number;
}

interface TelegramMessage {
  cid: number,
  fid: any,
  msg: string,
  date: string,
}

const schema = yup.object().shape({
  cid: yup.number().required(),
  fid: yup.object().nullable(),
  msg: yup.string().trim().required(),
  date: yup.string().trim().required(),
})

const router = new Router()

router.post('/', async (ctx: Context) => {
  try {
    Logger.info(Deno.inspect(ctx))

    const body = ctx.request.body()
    if (body.type !== 'json')
      throw new Error('Invalid Body')

    const data = await body.value
    const text = Deno.inspect(data)
    Logger.info('Oak got Request: ' + text)

    const message = await parse(data) as TelegramMessage
    Logger.info('Oak got message: ' + Deno.inspect(message))

    ctx.response.body = `Oak send Response: ${body.type} "${text}"`
  }
  catch (error) {
    error.status = 422
    throw error
  }
})

async function parse(data: any) {
  try {
    return await schema.validate(data) as TelegramMessage
  }
  catch (error) {
    console.error(error)
  }
}

async function errorMiddleware (ctx: Context, next: any) {
  try {
    await next()
  }
  catch (err) {
    const error = err as RequestError;
    ctx.response.status = error.status || 500;
    ctx.response.body = {
      message: error.message,
    }
  }
}

export default class Server {

  #ctl = new AbortController()

  private readonly port = 8000
  private readonly host = 'localhost'
  private readonly app = new Application()

  public connected = false

  connect() {
    this.app.use(errorMiddleware)
    this.app.use(router.routes());
    this.app.use(router.allowedMethods());
    this.app.listen({
      port: this.port,
      hostname: this.host,
      signal: this.#ctl.signal,
    })
    this.connected = true
  }

  close () {
    this.#ctl.abort()
    this.connected = false
  }

}
