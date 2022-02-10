import type { BaseHandler } from 'std/log/handlers.ts'
import * as logging from 'std/log/mod.ts'
import { format } from 'std/datetime/mod.ts'

let handlers = [] as BaseHandler[]

const formatter = (logRecord: logging.LogRecord) => {
  const level = logRecord.levelName
  const date = format(logRecord.datetime, 'yyyy-MM-dd HH:mm:ss')
  const msg = logRecord.msg

  return `${date} ${level} ${msg} `
    + logRecord.args.map(arg => Deno.inspect(arg)).join(' ')
}

async function setup () {
  await logging.setup({

    handlers: {
      console: new logging.handlers.ConsoleHandler("WARNING"),

      file: new logging.handlers.FileHandler("DEBUG", {
        filename: "./logs/kingbot.log",
        formatter,
      }),

      mfile: new logging.handlers.FileHandler("NOTSET", {
        filename: "./logs/kingmsg.log",
        formatter,
      }),

      tfile: new logging.handlers.FileHandler("NOTSET", {
        filename: "./logs/kingram.log",
        formatter,
      }),

    },

    loggers: {
      default: {
        level: "NOTSET",
        handlers: ["file", "console"],
      },
      message: {
        level: "NOTSET",
        handlers: ["mfile"],
      },
      telegram: {
        level: "NOTSET",
        handlers: ["tfile"],
      },
    },

  })
  handlers = [
    ...Array.from(logging.getLogger('default').handlers),
    ...Array.from(logging.getLogger('message').handlers),
    ...Array.from(logging.getLogger('telegram').handlers),
  ]
  return logging.getLogger('default')
}

function flush () {
  handlers.forEach(handler => {
    if (handler instanceof logging.handlers.FileHandler)
      handler.flush()
  })
}

export default {
  flush,
  setup,
}
