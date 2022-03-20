import * as logging from 'std/log/mod.ts'
import { format } from 'std/datetime/mod.ts'

const level = 'NOTSET' as logging.LevelName
const loggers = {
  default: { level, handlers: ["file", "console"] },
  message: { level, handlers: ["mfile"] },
  tparser: { level, handlers: ["tpfile"] },
  tserver: { level, handlers: ["tsfile"] },
  binding: { level, handlers: ["infile"] },
}

const formatter = (logRecord: logging.LogRecord) => {
  const msg = logRecord.msg
  const args = logRecord.args.map(arg => Deno.inspect(arg))
  const date = format(logRecord.datetime, 'yyyy-MM-dd HH:mm:ss')
  const level = logRecord.levelName
  const preamble = `${date} ${level} ${msg} `
  const formattedRecord = preamble + args.join(' ')
  return formattedRecord.trim()
}

const handlers = {

  console: new logging.handlers.ConsoleHandler("WARNING"),

  file: new logging.handlers.FileHandler("DEBUG", {
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
