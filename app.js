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
const { ChainableTemporaryCredentials } = require("aws-sdk");
const httpPort= 80;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ],
		transports:['websocket'],
		credentials:true
	},
	allowEIO3:true,

});
const chat = io.of('/chat')


app.use(cors());
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



// //라우터 연결
app.use("/", loginRouter, reservationRouter, getLikeRouter, authRouter, reviewRouter, translateRouter, proverbRouter);


// WebRTC 시그널링
io.on('connection', (socket) => {
		socket.on('join-room', (roomId, userId) => {
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
			io.to(roomId).emit('user-disconnected', userId);
			socket.leave(roomId)
			io.in(roomId).disconnectSockets(true)
		});	
	});	
});

httpServer.listen(httpPort, ()=>{
	console.log('http서버가 켜졌어요 cicd확인');
});
