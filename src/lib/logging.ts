import { format } from 'std/datetime/mod.ts'
import * as logging from 'std/log/mod.ts'

const formatter = (logRecord: logging.LogRecord) => {
  const level = logRecord.levelName
  const date = format(logRecord.datetime, 'yyyy-MM-dd HH:mm:ss')
  const msg = logRecord.msg

  return `${date} ${level} ${msg} `
    + logRecord.args.map(arg => Deno.inspect(arg)).join(' ')
}

async function setup () {
  // custom configuration with 2 loggers (the default and `tasks` loggers).
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
    },

  })
  return logging.getLogger()
}

function flush () {
  const handlers = [
    ...Array.from(logging.getLogger().handlers),
    ...Array.from(logging.getLogger('message').handlers),
  ]
  handlers.forEach(handler => {
    if (handler instanceof logging.handlers.FileHandler)
      handler.flush()
  })
}

export default {
  flush,
  setup,
}
