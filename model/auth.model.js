const knex = require("../config/knex");

const checkData = (tableName, key, args) => {
  let result = knex(tableName).where(key, "=", args).first();
  return result;
};

const insertData = (tableName, data) => {
  let result = knex(tableName).insert(data);
  return result;
};

const insertToken = (tableName, key, args, data) => {
  let result = knex(tableName).where(key, "=", args).update(data);
  return result;
};

module.exports = { checkData, insertData, insertToken };
