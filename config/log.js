const winston = require("winston");
require("winston-daily-rotate-file");
const expressWinston = require("express-winston");
const fs = require("fs");
const moment = require("moment");

const filename = () => {
  if (!fs.existsSync(`./logs`)) {
    fs.mkdirSync(`./logs`);
  }
  if (!fs.existsSync(`./logs/${moment().format("YYYY")}`)) {
    fs.mkdirSync(`./logs/${moment().format("YYYY")}`);
  }
  if (
    !fs.existsSync(`./logs/${moment().format("YYYY")}/${moment().format("MM")}`)
  ) {
    fs.mkdirSync(`./logs/${moment().format("YYYY")}/${moment().format("MM")}`);
  }

  return `logs/${moment().format("YYYY")}-${moment().format(
    "MM"
  )}-${moment().format("DD")}.log`;
};

filename();

const logger = {
  response: expressWinston.logger({
    transports: [
      new winston.transports.DailyRotateFile({
        filename: "./logs/%DATE%.log",
        frequency: "24h",
        datePattern: "YYYY/MM/DD",
        zippedArchive: true,
        maxFiles: "1d",
      }),
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info) => {
        let body = {};
        body.id = info.meta.req.id;
        body.tag = "RES";
        body.from = info.meta.req.ip;
        body.method = info.meta.req.method;
        body.endpoint = info.meta.req.originalUrl;
        body.time = moment().format();
        body.responseTime = `${info.meta.responseTime} ms`;

        var header_auth = info.meta.req.headers["authorization"];
        var issuer_name =
          header_auth === undefined
            ? "Web"
            : getIssuerMonitoring(header_auth.split(" ")[1]);
        if (!issuer_name)
          return `[${moment().format()}] | ${JSON.stringify(body)}`;

        return `[${moment().format()}] | ${JSON.stringify(body)}`;
      })
    ),
    responseWhitelist: [...expressWinston.responseWhitelist, "body"],
    requestWhitelist: [...expressWinston.requestWhitelist, "body", "id", "ip"],
  }),
  request: expressWinston.logger({
    transports: [
      new winston.transports.DailyRotateFile({
        filename: "./logs/%DATE%.log",
        frequency: "24h",
        datePattern: "YYYY/MM/DD",
        zippedArchive: true,
        maxFiles: "1d",
      }),
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info) => {
        let body = {};
        body.id = info.meta.req.id;
        body.tag = "REQ";
        body.from = info.meta.req.ip;
        body.method = info.meta.req.method;
        body.endpoint = info.meta.req.originalUrl;
        body.time = moment().format();
        return `[${moment().format()}] | ${JSON.stringify(body)}`;
      })
    ),
    requestWhitelist: [...expressWinston.requestWhitelist, "body", "id", "ip"],
  }),
};

module.exports = { logger, filename };
