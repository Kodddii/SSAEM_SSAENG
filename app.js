require("dotenv").config();
const express = require("express");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const routers = require("./routes/logins");

const app = express();

// //접속로그 확인
// const requestMiddleware = (req, res, next) => {
//   console.log("Request URL:", req.originalUrl, "-", new Date());
//   next();
// };

//미들웨어
app.use(cors());
app.use(express.json());
// app.use(requestMiddleWare);
app.use(express.urlencoded({ extended: false }));

//라우터 연결
app.use("/", routers);

// app.use(express.static("assets"));

app.listen(3000, () => {
  console.log("3000번 포트에서 대기중!");
});
