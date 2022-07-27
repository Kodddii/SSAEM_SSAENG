require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportConfig = require('./passport');
const peer = require("peer");
const helmet = require("helmet");
const {Server} = require("socket.io");
const rateLimit = require('express-rate-limit');
 
const app = express();

// 라우터선언
const loginRouter = require("./routes/login");
const reservationRouter = require("./routes/reservation");
const getLikeRouter = require("./routes/getLike");
const reviewRouter = require('./routes/review');
const authRouter = require('./routes/auth');
const translateRouter = require('./routes/translate');
const proverbRouter = require('./routes/proverb')
const requestMiddleware = (req, res, next) => { console.log( "ip:", req.ip, "domain:", req.rawHeaders[1], "method:", req.method, "Request URL:", req.originalUrl, "-", new Date() ); next(); };
passportConfig();
// app.set('port', 3000);
const fs = require("fs");
const http = require("http");
const https = require("https");
const res = require("express/lib/response");

// Create the rate limit rule
const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200, // limit each IP to 2 requests per windowMs
    handler: function (req, res /*next*/) {
        return res.status(429).json({
            error: 'You sent too many requests. Please wait a while then try again',
        });
    },
});



//////////////////////////////////////////////////////////////////
// https 인증관련
const httpPort= 80;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ],
		transports:['websocket'],
		credentials:true
		// cors 인증서 사용 : origin 다른 resource 일때 
		// cors문제로 인해 쿠키가 없으므로 쿠키를 헤더에 넣어주는것
	},
	allowEIO3:true,

});
const chat = io.of('/chat')


app.use(cors());
app.get("/loaderio-c796deb06d2adb9ef0dac78637799037.txt",(req,res)=>{
	res.sendFile(__dirname+"/loaderio-c796deb06d2adb9ef0dac78637799037.txt")
})
app.get("/abc", (req, res) => { res.status(200).json({ msg: "good" }); });
//미들웨어

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: false,
      secure: true,
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
app.use(helmet());
app.use(requestMiddleware)


// Use the limit rule as an application middleware
app.use(apiRequestLimiter)

// https 인증관련
// app.get('/.well-known/pki-validation/69DCB230704B206B1161AA5BC7E57864.txt', (req,res)=>{
// 	res.sendFile(__dirname + '/well-known/pki-validation/69DCB230704B206B1161AA5BC7E57864.txt')
//   });
// app_low.use((req,res,next)=>{
// 	if(req.secure){
// 	  next();
// 	}else{
// 	  const to = `https://${req.hostname}:${httpsPort}${req.url}`;
// 	  console.log(to);
// 	  res.redirect(to)
// 	}
//   })
// //라우터 연결
app.use("/", loginRouter, reservationRouter, getLikeRouter, authRouter, reviewRouter, translateRouter, proverbRouter);


// WebRTC 시그널링
io.on('connection', (socket) => {
		socket.on('join-room', (roomId, userId) => {
		// 방인원수 따라 join
		let rooms = io.sockets.adapter.rooms;
		let room = rooms.get(roomId);
		if (room === undefined){
			socket.join(roomId);
		}else if(room.size ===1){
			socket.join(roomId)
		}else if(room.size >=2){
			return;
		}
		io.to(roomId).emit('user-connected', userId);
		socket.on('disconnect', () => {
			// 접속끊겼을때 방나가기
			io.to(roomId).emit('user-disconnected', userId);
			socket.leave(roomId)
			io.in(roomId).disconnectSockets(true)
		});	
	});	
});

httpServer.listen(httpPort, ()=>{
	console.log('http서버가 켜졌어요 cicd확인확인');
});
