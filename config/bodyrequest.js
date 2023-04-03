const bodyrequest = () => {
  let body = {};
  body.id = req.originalUrl;

  return JSON.stringify(body)
};

module.exports = bodyrequest;
