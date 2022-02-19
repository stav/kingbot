import * as log from 'std/log/mod.ts'

async function setup () {
  // custom configuration with 2 loggers (the default and `tasks` loggers).
  await log.setup({

    handlers: {
      console: new log.handlers.ConsoleHandler("WARNING"),

      file: new log.handlers.FileHandler("DEBUG", {
        filename: "./logs/kingbot.log",
        formatter: "{datetime} {levelName} {msg}",
      }),
    },

    loggers: {
      default: {
        level: "NOTSET",
        handlers: ["file", "console"],
      },
      // tasks: {
      //   level: "ERROR",
      //   handlers: ["console", "file"],
      // },
    },

  })
  return log.getLogger()
}

export default {
  setup,
}
