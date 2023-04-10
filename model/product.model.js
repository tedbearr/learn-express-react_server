const knex = require("../config/knex");

const insertData = (tableName, data) => {
  let result = knex(tableName).insert(data);
  return result;
};

const getAllData = (tableName) => {
  let result = knex(tableName).where("status", "!=", "X");
  return result;
};

const getSpecifiedData = (tableName, key, args) => {
  let result = knex(tableName).where(key, "=", args).first();
  return result;
};

const updateData = (tableName, key, args, data) => {
  let result = knex(tableName).where(key, "=", args).update(data);
  return result;
};

const checkData = (tableName, key, args) => {
  let result = knex(tableName).where(key, "=", args).first();
  return result;
};

module.exports = {
  insertData,
  getAllData,
  getSpecifiedData,
  updateData,
  checkData,
};
