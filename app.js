require("dotenv").config();
const express = require('express');
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

//* 라우터
app.use('/', authRouter, reviewRouter);

// app.use('/', reviewRouter)

app.get('/', function (req, res) {
  res.send('메인페이지 입니다!!!')
})

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});

// module.exports = app;