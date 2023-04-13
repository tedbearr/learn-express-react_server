const { count_metrics } = require("../config/metricsPrometheus");
const moment = require("moment");
moment.locale("id");

const promMiddleware = (req, res, next) => {
  res.on("finish", () => {
    // return console.log(res.body.code)
    // console.log(`request url = ${req.originalUrl}`);
    // console.log(res.getHeader("x-response-time"));
    // console.log(res.statusCode);

    let url = req.originalUrl;
    let responseTime = Math.round(parseInt(res.getHeader("x-response-time")));
    let statusCode = res.body.code;
    let method = req.method;
    let date = moment().format("D");
    let month = moment().format("M");
    let year = moment().format("Y");

    if (statusCode != "00") {
      count_metrics
        .labels({
          issuer_name: "CMS",
          method: method,
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
          issuer_name: "CMS",
          method: method,
          route: url,
          status_code: statusCode,
          date: date,
          month: month,
          year: year,
        })
        .observe(responseTime);
    }
  });
  next();
};

module.exports = { promMiddleware };
