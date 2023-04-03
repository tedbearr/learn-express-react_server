require("dotenv").config();

let host;
let database;
let port;
let user;
let password;

if (process.env.SERVER_FOR == "local") {
  host = "localhost";
  database = "CMS";
  port = 5432;
  user = "postgres";
  password = "galau712";
} else if (process.env.SERVER_FOR == "development") {
  //   host = "10.20.14.14";
  //   database = "postgres";
  //   port = 5432;
  //   user = "cms";
  //   password = "Cm5kc1#2021";
} else if (process.env.SERVER_FOR == "production") {
  //   host = "10.1.201.75";
  //   database = "postgres";
  //   port = 5432;
  //   user = "postgres";
  //   password = "inhc0mmute_cms";
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
