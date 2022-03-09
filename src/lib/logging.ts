import * as logging from 'std/log/mod.ts'
import { format } from 'std/datetime/mod.ts'

const level = 'NOTSET' as logging.LevelName
const loggers = {
  default: { level, handlers: ["file", "console"] },
  message: { level, handlers: ["mfile"] },
  telegram: { level, handlers: ["tfile"] },
}

const formatter = (logRecord: logging.LogRecord) => {
  const level = logRecord.levelName
  const date = format(logRecord.datetime, 'yyyy-MM-dd HH:mm:ss')
  const msg = logRecord.msg

  return `${date} ${level} ${msg} `
    + logRecord.args.map(arg => Deno.inspect(arg)).join(' ')
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

  tfile: new logging.handlers.FileHandler("NOTSET", {
    filename: "./logs/kingram.log",
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
