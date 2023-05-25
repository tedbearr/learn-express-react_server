require("dotenv").config();

let host;
let database;
let port;
let user;
let password;

if (process.env.SERVER_FOR == "local") {
  host = process.env.DB_HOST || "localhost";
  database = process.env.DB_NAME || "learn-express-react";
  port = process.env.DB_PORT || "5432";
  user = process.env.DB_USERNAME || "postgres";
  password = process.env.DB_PASSWORD || "galau712";
} else if (process.env.SERVER_FOR == "development") {
  //   host = "10.20.14.14";
  //   database = "postgres";
  //   port = 5432;
  //   user = "cms";
  //   password = "Cm5kc1#2021";
} else if (process.env.SERVER_FOR == "production") {
    host = "103.54.170.25";
    database = "postgres";
    port = "5432";
    user = "postgres";
    password = "123456";
}

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: host,
      database: database,
      user: user,
      password: password,
    },
    // connection: process.env.DB_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./infrastructure/database/migrations",
    },
  },

  testing: {
    client: "pg",
    connection: process.env.DB_URL,
    migrations: {
      directory: "./infrastructure/database/migrations",
    },
    seeds: { directory: "./infrastructure/database/seeds" },
  },

  production: {
    client: "pg",
    connection: {
      host: host,
      database: database,
      user: user,
      password: password,
    },
    // connection: process.env.DB_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./infrastructure/database/migrations",
    },
  },
};
