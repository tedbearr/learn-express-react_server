const winstonLoki = require("../config/lokiWinstonLog");

const lokiMiddleware = (req, res, next) => {
// return console.log(res)
  res.on("finish", () => {
    // return console.log(res.body.code)
    //   console.log(`request url = ${req.originalUrl}`);
    //   console.log(res.getHeader("x-response-time"));
    //   console.log(res.statusCode);

    let url = req.originalUrl;
    let responseTime = res.body.responseTime;
    let statusCode = res.body.code;
    let method = req.method;

    if (statusCode != "200" && statusCode != "204") {
      winstonLoki.log.error({
        message: "error",
        labels: {
          method: method,
          url: url,
          responseTime: responseTime,
          status: statusCode,
          //   data: res.body.data,
        },
      });
    } else {
      winstonLoki.log.info({
        message: "success",
        labels: {
          method: method,
          url: url,
          responseTime: responseTime,
          status: statusCode,
          //   data: res.body.data,
        },
      });
    }
  });
  next();
};

module.exports = lokiMiddleware;
