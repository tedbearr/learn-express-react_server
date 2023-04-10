const moment = require("moment");
moment.locale("id");
const { body, validationResult } = require("express-validator");
const winston = require("../config/winstonLog");
const model = require("../model/product.model");

const validate = (method) => {
  switch (method) {
    case "insert": {
      return [
        body("name").not().isEmpty().withMessage("Product name is required"),
        body("stock").not().isEmpty().withMessage("Stock is required"),
        body("price").not().isEmpty().withMessage("Price is required"),
        body("description")
          .not()
          .isEmpty()
          .withMessage("Description is required"),
      ];
    }
  }
};

const getAllData = async (req, res, next) => {
  try {
    let tableName = "products";

    let result = await model.getAllData(tableName);

    return res.status(200).json({
      code: "00",
      message: "Success get data",
      data: result,
    });
  } catch (error) {
    res.status(200).json({
      code: "500",
      message: error.message,
      data: {},
    });
  }
};

const getSpecifiedData = async (req, res, next) => {
  try {
    let { id } = req.params;
    let tableName = "products";
    let key = "id";
    let args = id;
    let result = {};

    let checkData = await model.checkData(tableName, key, args);
    if (!checkData) {
      result = {
        code: "400",
        message: "Data doesn't exists",
        data: {},
      };
      return res.status(200).json(result);
    }

    result = await model.getSpecifiedData(tableName, key, args);

    res.status(200).json({
      code: "00",
      message: "Success get data",
      data: result,
    });
  } catch (error) {
    res.status(200).json({
      code: "500",
      message: error.message,
      data: {},
    });
  }
};

const insertData = async (req, res, next) => {
  try {
    let { name, price, stock, description } = req.body;
    let result = {};
    let tableName = "products";

    const err = validationResult(req);
    if (!err.isEmpty()) {
      result = {
        code: "400",
        message: err.errors[0].msg,
        data: {},
      };

      winston.log.warn(`Response Insert Product : ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    }

    let data = {
      name: name,
      price: price,
      stock: stock,
      description: description,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      created_by: null,
    };

    winston.log.debug(`Processing products : inserting data...`);
    let insertResult = await model.insertData(tableName, data);
    result = {
      code: "00",
      message: "Insert Product Successfully",
      data: insertResult.command,
    };

    winston.log.info(`Response products : ${JSON.stringify(result)}`);

    res.status(200).json(result);
  } catch (error) {
    winston.log.error(`Response products : ${error.message}`);
    res.status(200).json({
      code: "500",
      message: error.message,
      data: {},
    });
  }
};

const searchData = async () => {};

const updateData = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { name, stock, price, description } = req.body;
    let result = {};
    let tableName = "products";
    let key = "id";
    let args = id;

    winston.log.info(`Request Update Product : ${JSON.stringify(req.body)}`);

    const err = validationResult(req);
    if (!err.isEmpty()) {
      result = {
        code: "400",
        message: err.errors[0].msg,
        data: {},
      };

      winston.log.warn(`Response Update Product : ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    }

    let checkData = await model.checkData(tableName, key, args);
    if (!checkData) {
      result = {
        code: "400",
        message: "Data doesn't exists",
        data: {},
      };
      return res.status(200).json(result);
    }

    let data = {
      name: name,
      price: price,
      stock: stock,
      description: description,
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      updated_by: null,
    };

    winston.log.debug(`Processing products : updating data...`);
    let insertResult = await model.updateData(tableName, key, args, data);
    result = {
      code: "00",
      message: "Update Product Successfully",
      data: insertResult.command,
    };

    winston.log.info(`Response Update Products : ${JSON.stringify(result)}`);

    res.status(200).json(result);
  } catch (error) {
    winston.log.error(`Response products : ${error.message}`);
    res.status(200).json({
      code: "500",
      message: error.message,
      data: {},
    });
  }
};

const deleteData = async (req, res, next) => {
  try {
    let { id } = req.body;
    let result = {};
    let tableName = "products";
    let key = "id";
    let args = id;
    console.log(id);

    winston.log.info(`Request Delete Product : ${JSON.stringify(req.body)}`);

    let checkData = await model.checkData(tableName, key, args);
    if (!checkData) {
      result = {
        code: "400",
        message: "Data doesn't exists",
        data: {},
      };
      return res.status(200).json(result);
    }

    let data = {
      status: "X",
      deleted_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      deleted_by: null,
    };

    winston.log.debug(`Processing products : deleting data...`);
    let insertResult = await model.updateData(tableName, key, args, data);
    result = {
      code: "00",
      message: "Delete Product Successfully",
      data: insertResult.command,
    };

    winston.log.info(`Response Delete Products : ${JSON.stringify(result)}`);

    res.status(200).json(result);
  } catch (error) {
    winston.log.error(`Response products : ${error.message}`);
    res.status(200).json({
      code: "500",
      message: error.message,
      data: {},
    });
  }
};

module.exports = {
  validate,
  getAllData,
  getSpecifiedData,
  insertData,
  searchData,
  updateData,
  deleteData,
};
