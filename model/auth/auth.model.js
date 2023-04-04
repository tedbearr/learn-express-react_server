const knex = require("../../config/knex");

const checkDataRegister = (username) => {
  let result = knex("users").where("username", "=", username).first();
  return result;
};

const insertData = (data) => {
  let result = knex("users").insert(data);
  return result;
};

const insertToken = (username, data) => {
  let result = knex("users").where("username", "=", username).update(data);
  return result;
};

module.exports = { checkDataRegister, insertData, insertToken };
