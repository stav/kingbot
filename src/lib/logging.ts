import * as logging from 'std/log/mod.ts'

async function setup () {
  // custom configuration with 2 loggers (the default and `tasks` loggers).
  await logging.setup({

    handlers: {
      console: new logging.handlers.ConsoleHandler("WARNING"),

      file: new logging.handlers.FileHandler("DEBUG", {
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
  return logging.getLogger()
}

export default {
  setup,
}
