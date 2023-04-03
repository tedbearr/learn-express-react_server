require("dotenv").config();
const redis = require("redis");

let redisClient;
(async () => {
  let redisUrl = process.env.REDIS_URL;
  let redisPass = process.env.REDIS_PASSWORD;

  redisClient = redis.createClient({
    url: redisUrl,
    password: redisPass,
  });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  redisClient.on("connect", () => console.log("Redis is Connected"));

  redisClient.on("ready", () => console.log("Redis is Ready"));

  redisClient.on("reconnecting", () => console.log("Redis is Reconnecting"));

  await redisClient.connect();
})();

const redisMiddleware = async (req, res, next) => {
  let isRedisReady = await redisClient.isReady;
  if (!isRedisReady) {
    next();
  } else {
    let getValue = await redisClient.get("cardproduct");
    let parsedValue = JSON.parse(getValue);

    if (getValue) {
      res.status(200).json({
        code: 200,
        message: "Success get from redis",
        data: parsedValue,
      });
    } else {
      res.on("finish", async () => {
        // console.log(res.body.data);
        await redisClient.set("cardproduct", JSON.stringify(res.body.data), {
          EX: 10,
          NX: false,
        });
      });
    }
    next();
  }
};

module.exports = redisMiddleware;
