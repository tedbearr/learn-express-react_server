const express = require("express");
const router = express.Router();
const knex = require("../config/knex");
const winston = require("../config/winstonLog");
const winstonLoki = require("../config/lokiWinstonLog");

router.get("/", async (req, res) => {
  try {
    await knex
      .select("*")
      .from("t_m_card_product")
      .limit(100)
      .then((data) => {
        res.status(200).json({
          code: 200,
          message: "Success get data",
          data: data,
        });
        winston.log.info(`Success get data card product`);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message: error,
          data: {},
        });
      });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;

  try {
    knex("public.t_m_card_product")
      .where("i_card_product", id)
      .then((data) => {
        if (data.length == 0) {
          res.status(200).json({
            code: 200,
            message: "No data",
            data: data,
          });
        } else {
          res.status(200).json({
            code: 200,
            message: "Success get data",
            data: data,
          });
        }
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message: error.detail,
          data: {},
        });
        winston.log.error(`Fail to get data card product`);
      });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  let body = req.body;
  await knex.transaction((trx) => {
    try {
      knex("public.t_m_card_product")
        .insert(body)
        .then((data) => {
          res.status(200).json({
            code: 200,
            message: "Success insert data",
            data: data,
          });
          winston.log.info(`Success insert data card product`);
          trx.commit;
        })
        .catch((error) => {
          trx.rollback;
          res.status(400).json({
            code: 400,
            message: error.detail,
            data: [],
          });
          winston.log.error(`${error.detail}`);
        });
    } catch (error) {
      console.log(error);
    }
  });
});

router.put("/:id", async (req, res) => {
  let id = req.params.id;
  let body = req.body;
  await knex.transaction((trx) => {
    try {
      knex("public.t_m_card_product")
        .where("i_card_product", id)
        .update(body)
        .then((data) => {
          res.status(200).json({
            code: 200,
            message: "Success update data",
            data: data,
          });
          trx.commit;
        })
        .catch((error) => {
          trx.rollback;
          res.status(400).json({
            code: 400,
            message: `Fail to update data cause ${error.detail}`,
            data: data,
          });
          winston.log.error(`${error.detail}`);
        });
    } catch (error) {
      winston.log.error(`${error}`);
      console.log(error);
    }
  });
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  knex.transaction((trx) => {
    try {
      knex("public.t_m_card_product")
        .where("i_card_product", id)
        .del()
        .then((data) => {
          res.status(200).json({
            code: 200,
            message: "Success delete data",
            data: data,
          });
          trx.commit;
        })
        .catch((error) => {
          trx.rollback;
          res.status(400).json({
            code: 400,
            message: `Fail to update data cause ${error.detail}`,
            data: data,
          });
          winston.log.error(`${error.detail}`);
        });
    } catch (error) {
      winston.log.error(`${error}`);
      console.log(error);
    }
  });
});

module.exports = router;
