import * as logging from 'std/log/mod.ts'
import { format } from 'std/datetime/mod.ts'

const level = 'NOTSET' as logging.LevelName
const loggers = {
  default: { level, handlers: ["kfile", "console"] },
  tparser: { level, handlers: ["kfile", "tpfile"] },
  tserver: { level, handlers: ["kfile", "tsfile"] },
  message: { level, handlers: ["mfile"] },
  binding: { level, handlers: ["infile"] },
  sending: { level, handlers: ["snfile"] },
}

const formatter = (logRecord: logging.LogRecord) => {
  const msg = logRecord.msg
  const utc = logRecord.datetime.toJSON().replace('Z', '') // Pretend we're in UTC
  const args = logRecord.args.map(arg => Deno.inspect(arg))
  const date = format(new Date(utc), 'yyyy-MM-dd HH:mm:ss UTC')
  const name = logRecord.loggerName
  const level = logRecord.levelName
  const preamble = `${date} ${level} [${name}] ${msg} `
  const formattedRecord = preamble + args.join(' ')
  return formattedRecord.trim()
}

const handlers = {

  console: new logging.handlers.ConsoleHandler("WARNING", { formatter }),

  kfile: new logging.handlers.FileHandler("DEBUG", {
    filename: "./logs/kingbot.log",
    formatter,
  }),

  mfile: new logging.handlers.FileHandler("NOTSET", {
    filename: "./logs/kingmsg.log",
    formatter,
  }),

  tpfile: new logging.handlers.FileHandler("NOTSET", {
    filename: "./logs/telegram-parser.log",
    formatter,
  }),

  tsfile: new logging.handlers.FileHandler("NOTSET", {
    filename: "./logs/telegram-server.log",
    formatter,
  }),

  infile: new logging.handlers.FileHandler("NOTSET", {
    filename: "./logs/bindings.log",
    formatter,
  }),

  snfile: new logging.handlers.FileHandler("NOTSET", {
    filename: "./logs/send.log",
    formatter,
  }),

}
const _handlers = Object.values(handlers)

async function setup () {
  await logging.setup({ handlers, loggers })
  return logging.getLogger('default')
}

function flush () {
  _handlers.forEach(handler => {
    if (handler instanceof logging.handlers.FileHandler)
      handler.flush()
  })
}

export default {
  flush,
  setup,
}
