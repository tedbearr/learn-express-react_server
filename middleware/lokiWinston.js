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
    let message = res.body.message;

    if (statusCode != "00") {
      winstonLoki.log.error({
        message: message,
        labels: {
          method: method,
          route: url,
          responseTime: responseTime,
          status: statusCode,
          //   data: res.body.data,
        },
      });
    } else {
      winstonLoki.log.info({
        message: message,
        labels: {
          method: method,
          route: url,
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
