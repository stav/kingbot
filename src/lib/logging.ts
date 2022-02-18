import * as log from 'std/log/mod.ts'

function logger () {
  return log.getLogger()
}

async function setup () {
  // custom configuration with 2 loggers (the default and `tasks` loggers).
  await log.setup({

    handlers: {
      console: new log.handlers.ConsoleHandler("DEBUG"),

      file: new log.handlers.FileHandler("WARNING", {
        filename: "./logs/kingbot.log",
        formatter: "{datetime} {levelName} {msg}",
      }),
    },

    loggers: {
      // configure default logger available via short-hand methods above.
      default: {
        level: "DEBUG",
        handlers: ["file"],
      },

      tasks: {
        level: "ERROR",
        handlers: ["console", "file"],
      },
    },

  })
}

export default {
  logger,
  setup,
}
