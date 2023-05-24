const winston = require("winston");
require("winston-daily-rotate-file");
const expressWinston = require("express-winston");
const fs = require("fs");
const moment = require("moment");
const winstonLoki = require("../config/lokiWinstonLog");
const { count_metrics } = require("../config/metricsPrometheus");

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

const route = [
  "/api/products/admin/get-all-data",
  "/api/products/admin/get-specified-data/2",
];

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
        // console.log(info.meta.req);
        let body = {};
        body.id = info.meta.req.id;
        body.tag = "RES";
        body.from = info.meta.req.ip;
        body.method = info.meta.req.method;
        body.endpoint = info.meta.req.originalUrl;
        body.time = moment().format();
        body.responseTime = `${info.meta.responseTime} ms`;

        // var header_auth = info.meta.req.headers["authorization"];
        // var issuer_name = header_auth === "learn";

        let statusCode = info.meta.res.body.code;
        let message = info.meta.res.body.message;
        let url = info.meta.req.originalUrl;
        let responseTime = info.meta.responseTime

        let date = moment().format("D");
        let month = moment().format("M");
        let year = moment().format("Y");

        winstonLoki.log.info({
          message: message,
          labels: {
            route: url,
            status: statusCode,
            //   data: res.body.data,
          },
        });

        if (statusCode != "00") {
          count_metrics
            .labels({
              issuer_name: "Test",
              route: url,
              status_code: statusCode,
              date: date,
              month: month,
              year: year,
            })
            .observe(responseTime);
        } else {
          count_metrics
            .labels({
              issuer_name: "Test",
              route: url,
              status_code: statusCode,
              date: date,
              month: month,
              year: year,
            })
            .observe(responseTime);
        }

        return `[${moment().format()}] | ${JSON.stringify(body)}`;
      })
    ),
    skip: function (req, res) {
      console.log(req.originalUrl);
      return route.indexOf(req.originalUrl) === -1;
    },
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
    skip: (req, res) => {
      return route.indexOf(req.originalUrl) === -1;
    },
    requestWhitelist: [...expressWinston.requestWhitelist, "body", "id", "ip"],
  }),
};

module.exports = { logger, filename };
