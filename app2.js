require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const loginRouter = require("./routes/login");
const reservationRouter = require("./routes/reservation");
const getLikeRouter = require("./routes/getLike");
const translateRouter = require("./routes/translate")
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportConfig = require('./passport');
const reviewRouter = require('./routes/review');
const authRouter = require('./routes/auth')
const app_low = express();
const app = express();
passportConfig();
// app.set('port', 3000);
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
const fs = require("fs")
const http = require("http")
const https = require("https")
const SocketIO = require("socket.io")


const rateLimit = require('express-rate-limit');

// Create the rate limit rule
const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 2, // limit each IP to 2 requests per windowMs
    handler: function (req, res /*next*/) {
        return res.status(429).json({
            error: 'You sent too many requests. Please wait a while then try again',
        });
    },
});

// Use the limit rule as an application middleware
app.use(apiRequestLimiter)


// //////////////////////////////////////////////////////////////////
// // https 인증관련
// const httpPort= 80;
// const httpsPort = 443;
// const privateKey = fs.readFileSync(__dirname + '/private.key', 'utf8');
// const certificate = fs.readFileSync(__dirname + '/certificate.crt', 'utf8');
// const ca = fs.readFileSync(__dirname + '/ca_bundle.crt', 'utf8');
// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca,
// };
// const httpServer = http.createServer(app_low);
// const httpsServer = https.createServer(credentials,app)
// // socket.io https 서버
// const io = SocketIO(httpsServer, {
//  cors: {
//    origin: "*",
//    methods: [ "GET", "POST" ]
//  }
// });
// /////////////////////////////////////////////////////////
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
// // https 인증관련
// app.get('/.well-known/pki-validation/69DCB230704B206B1161AA5BC7E57864.txt', (req,res)=>{
//  res.sendFile(__dirname + '/well-known/pki-validation/69DCB230704B206B1161AA5BC7E57864.txt')
//   });
// app_low.use((req,res,next)=>{
//  if(req.secure){
//    next();
//  }else{
//    const to = `https://${req.hostname}:${httpsPort}${req.url}`;
//    console.log(to);
//    res.redirect(to)
//  }
//   })
//라우터 연결
app.use("/", loginRouter, reservationRouter, getLikeRouter, authRouter, reviewRouter, translateRouter);
// app.use(express.static("assets"));
app.get('/', function (req, res) {
  res.send('메인페이지 입니다!!!')
})
// app.listen(3000, () => {
//   console.log("3000번 포트에서 대기중!");
// });
app.listen(3000, () => {
  console.log("3000번 포트에서 대기중!");
});