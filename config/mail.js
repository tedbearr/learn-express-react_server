const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "menkusai7@gmail.com",
    pass: "nzlnlyntztlaqkqx",
  },
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./views/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views/"),
};

transporter.use("compile", hbs(handlebarOptions));

var mailOptions = {
  from: "testing",
  to: "menkusai@gmail.com",
  subject: "Welcome",
  template: "email",
  context: {
    name: "Test",
  },
};

const sendEmail = (req, res) => {
  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(200).json({
          code: "400",
          message: error,
          data: [],
        });
      } else {
        return res.status(200).json({
          code: "200",
          message: "Success send email",
          data: [],
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail };
