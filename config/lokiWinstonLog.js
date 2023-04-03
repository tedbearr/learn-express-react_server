const moment = require("moment");
const winston = require("winston");
const loki = require("winston-loki");
require("winston-daily-rotate-file");
require("dotenv").config();
const { combine, timestamp, printf, colorize, align, json } = winston.format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};
var log;

//
// Replaces the previous transports with those in the
// new configuration wholesale.
//
// const DailyRotateFile = require("winston-daily-rotate-file");
// log.configure({
//   level: "verbose",
//   transports: [new DailyRotateFile()],
// });

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: `./logs/%DATE%-onlinetopup.log`,
  datePattern: "YYYY-MM-DD",
  maxFiles: "90d",
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

if (
  process.env.NODE_ENV == "production" ||
  process.env.NODE_ENV == "PRODUCTION"
) {
  log = winston.createLogger({
    levels: logLevels,
    level: process.env.LOG_LEVEL || "info",
    exitOnError: false,
    //   format: combine(timestamp(), json()),
    format: combine(
      // colorize({ all: true }),
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS",
      }),
      align(),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    defaultMeta: { service: "learn-express-react" },
    transports: [
      new loki({
        host: "http://localhost:3100/loki/api/v1/push",
        labels: { app: "honeyshop" },
        json: true,
        format: json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.error(err),
      }),
      new transports.Console({
        format: format.combine(format.simple(), format.colorize()),
      }),
      // new winston.transports.Http({ host: "localhost", port: 3008 }),
      // fileRotateTransport,
      // //
      // // - Write all logs with importance level of `error` or less to `error.log`
      // // - Write all logs with importance level of `info` or less to `onlinetopup.log`
      // //
      // new winston.transports.File({
      //   filename: `./logs/error.log`,
      //   level: "error",
      // }),
      // new winston.transports.File({
      //   filename: `application/logs/${moment().format("YYYY-MM-DD")}-onlinetopup.log`,
      // }),
    ],
  });
} else {
  log = winston.createLogger({
    transports: [
      new loki({
        host: "http://localhost:3100",
        labels: { app: "testLoki" },
        handleExceptions: true,
        handleRejections: true,
        clearOnError: true,
        json: true,
        format: json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.log(`Loki error ${err}`),
      }),
      new winston.transports.Console({
        format: combine(colorize()),
      }),
    ],
  });
}

if (process.env.NODE_ENV != "testing" && process.env.NODE_ENV != "TESTING") {
  log.add(
    new winston.transports.Console({
      //   format: winston.format.cli(),
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss.SSS",
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    })
  );
}

module.exports = {
  log,
};
