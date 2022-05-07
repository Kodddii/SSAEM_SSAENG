require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const loginRouter = require("./routes/logins");
const reservationRouter = require("./routes/reservation")
const getLikeRouter = require("./routes/getLike")
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportConfig = require('./passport');
const reviewRouter = require('./routes/review');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth')

const app = express();
passportConfig();
app.set('port', 3000);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }),
);

//! express-session에 의존하므로 뒤에 위치해야 함
app.use(passport.initialize()); // 요청(req) 객체에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport 인증 완료 정보를 추가 저장
// passport.session()이 실행되면, 세션쿠키 정보를 바탕으로 해서 passport/index.js의 deserializeUser()가 실행하게 한다.

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
app.use("/", loginRouter, reservationRouter, getLikeRouter, authRouter, reviewRouter);

// app.use(express.static("assets"));


app.get('/', function (req, res) {
  res.send('메인페이지 입니다!!!')
})

app.listen(3000, () => {
  console.log("3000번 포트에서 대기중!");
});


