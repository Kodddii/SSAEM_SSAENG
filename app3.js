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
const app_high=express();

const loginRouter = require("./routes/login");
const reservationRouter = require("./routes/reservation");
const getLikeRouter = require("./routes/getLike");
const reviewRouter = require('./routes/review');
const authRouter = require('./routes/auth');
const translateRouter = require('./routes/translate');
const requestMiddleware = (req, res, next) => { console.log( "ip:", req.ip, "domain:", req.rawHeaders[1], "method:", req.method, "Request URL:", req.originalUrl, "-", new Date() ); next(); };
passportConfig();
// app.set('port', 3000);
const fs = require("fs");
const http = require("http");
const https = require("https");
const { ChainableTemporaryCredentials } = require("aws-sdk");
const httpPort = 80;
const httpsPort = 443;

// const chat = io.of('/chat')

//////////////////////////////////////////////////////////////////
// https 인증관련
const privateKey = fs.readFileSync(__dirname + '/jg-jg_shop.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '/jg-jg_shop__crt.pem', 'utf8');
const ca = fs.readFileSync(__dirname + '/jg-jg_shop__ca.pem', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials,app_high);
const io = new Server(httpsServer, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

// /////////////////////////////////////////////////////////

// //접속로그 확인
// const requestMiddleware = (req, res, next) => {
//   console.log("Request URL:", req.originalUrl, "-", new Date());
//   next();
// };
app.get("/abc", (req, res) => { res.status(200).json({ msg: "good" }); });
//미들웨어
app.use(cors());
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




// https 인증관련
// app.get('/.well-known/pki-validation/69DCB230704B206B1161AA5BC7E57864.txt', (req,res)=>{
// 	res.sendFile(__dirname + '/well-known/pki-validation/69DCB230704B206B1161AA5BC7E57864.txt')
//   });
app.use((req,res,next)=>{
	if(req.secure){
	  next();
	}else{
	  const to = `https://${req.hostname}:${httpsPort}${req.url}`;
	  console.log(to);
	  res.redirect(to)
	}
  })
// //라우터 연결
app.use("/", loginRouter, reservationRouter, getLikeRouter, authRouter, reviewRouter, translateRouter);

////// peer.js 코드
io.on('connection', (socket) => {
	console.log(1)
	socket.on('join-room', (roomId, userId) => {
	console.log(roomId)
	console.log(userId)
	let rooms = io.sockets.adapter.rooms;
	let room = rooms.get(roomId);
	
	if (room === undefined){
		console.log(2)
		socket.join(roomId);
	}else if(room.size ===1){
		console.log(3)
		socket.join(roomId)
	}else if(room.size >=2){
		console.log(4)
		return;
	}
	console.log(2.1)
	io.to(roomId).emit('user-connected', userId);
	console.log(2.2)
	
	socket.on('disconnect', () => {
		console.log(3)
		io.to(roomId).emit('user-disconnected', userId);
		socket.leave(roomId)
		console.log(3.5)
	});	
    });
	
});

// socket.disconnect();
// chat.on('connection',(socket)=>{
// 	socket.on('send_message', (Data) => {
// 		console.log(Data)
// 		socket.to(Data.room).emit('receive_message',({autor:Data.author, message:Data.message}));
// 		console.log(5)
// 	});
// })

//////////  simple peer 코드
// io.on("connection", (socket) => {
// 	console.log(1)
// 	// socket.emit("me", socket.id);
// 	socket.on('joinRoom',(roomName)=>{
// 		let rooms = io.sockets.adapter.rooms;
//     	let room = rooms.get(roomName);
// 		console.log(2)
// 		if (room == undefined) {
// 			console.log(2.1)
// 			socket.join(roomName);
// 			socket.emit("created");
// 			console.log(2.2)
// 		  } else if (room.size == 1) {
// 			  console.log(2.3)
// 			//room.size == 1 when one person is inside the room.
// 			socket.join(roomName);
// 			socket.emit("joined");
// 			console.log(2.4)
// 		  } else {
// 			//when there are already two people inside the room.
// 			socket.emit("full");
// 			console.log(2.5)
// 		  }
// 		  console.log(rooms);
// 		});
// 	socket.on("disconnect", () => {
// 		socket.broadcast.emit("callEnded")
// 	});
// 	socket.on("ready", function (roomName) {
// 		socket.broadcast.to(roomName).emit("ready"); //Informs the other peer in the room.
// 	  });
// 	socket.on('sendingSignal',({signal, roomName})=>{
// 		console.log(3)
// 		console.log({signal,roomName})
// 		socket.broadcast.emit("offer",signal)
// 		console.log(3.5)
// 	  })
// 	socket.on("returningSignal", ({ signal, roomName }) => {
// 		console.log({signal,roomName})
// 		console.log(4)
// 		io.to(roomName).emit("receivingSignal", signal)
// 		console.log(4.5)
// 	});
// })

// app.listen(3000, () => {
//   console.log("3000번 포트에서 대기중!");
// });


httpServer.listen(httpPort, ()=>{
	console.log('http서버가 켜졌어요 alert');
});
httpsServer.listen(httpsPort,() =>{
	console.log('https서버가 켜졌어요 ?')
});