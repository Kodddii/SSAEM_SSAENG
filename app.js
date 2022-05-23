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


//////////////////////////////////////////////////////////////////
// https 인증관련
const httpPort= 80;
// const httpsPort = 443;
// const privateKey = fs.readFileSync(__dirname + '/jg-jg_shop.key', 'utf8');
// const certificate = fs.readFileSync(__dirname + '/jg-jg_shop__crt.pem', 'utf8');
// const ca = fs.readFileSync(__dirname + '/jg-jg_shop__ca.pem', 'utf8');
// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca,
// };



// const privateKey = fs.readFileSync(__dirname + '/private.key', 'utf8');
// const certificate = fs.readFileSync(__dirname + '/certificate.crt', 'utf8');
// const ca = fs.readFileSync(__dirname + '/ca_bundle.crt', 'utf8');
// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca,
// };

const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials,app);

// socket.io https 서버
const io = new Server(httpServer, {
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
app.use("/", loginRouter, reservationRouter, getLikeRouter, authRouter, reviewRouter, translateRouter);

// app.use(express.static("assets"));


// app.get('/', function (req, res) {
//   res.send('메인페이지 입니다!!!')
// })

io.on('connection', (socket) => {
	console.log(1)
	socket.on('join-room', (roomId, userId) => {
	// let rooms = io.sockets.adapter.rooms;
	// let room = rooms.get(roomId)
	console.log(2)
	socket.join(roomId);
	console.log(2.1)
	io.to(roomId).emit('user-connected', userId);
	console.log(2.2)
  	
	socket.on('disconnect', () => {
		console.log(3)
		io.to(roomId).emit('user-disconnected', userId);
		console.log(3.5)
		  });
});
	socket.on('send_message', (data) => {
	socket.to(data.room).emit('receive_message', data);
	});
	socket.disconnect();
});

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

// io.on('connection', (socket) => {
// 		console.log(1)
// 		socket.on('join-room', (roomId, userId) => {
// 		let rooms = io.sockets.adapter.rooms;
// 		let room = rooms.get(roomId)
// 		console.log(2)
// 		if(room == undefined){
// 			console.log(2.1)
// 			socket.join(roomId)
// 			io.to(roomId).emit('user-connected', userId);
// 			console.log(2.2)
// 		}else if(room.size==1){
// 			console.log(2.3)
// 			socket.join(roomId)
// 			io.to(roomId).emit('user-connected', userId);
// 			console.log(2.4)
// 		}else{
// 			socket.emit('full')
// 		}
// 		console.log(2.2)

// 		socket.on("send_message", (data) => { 
// 			socket.to(data.room).emit("receive_message", data); 
// 		});
// 	  	socket.on('disconnect', () => {
// 		console.log(3)
// 		io.to(roomId).emit('user-disconnected', userId);
// 		console.log(3.5)
// 		});
// 		socket.disconnect();
// 	});
		
		
// });

  



  //   socket.disconnect();




// app.listen(3000, () => {
//   console.log("3000번 포트에서 대기중!");
// });
//////////////////////////////////////
// const users = {};



// const socketToRoom = {};

// io.on('connection', socket => {
//     socket.on("join room", roomID => {
// 		console.log(1)
//         if (users[roomID]) {
//             const length = users[roomID].length;
//             if (length === 4) {
//                 socket.emit("room full");
//                 return;
//             }
// 			console.log(2)
//             users[roomID].push(socket.id);
//         } else {
// 			console.log(2.5)
//             users[roomID] = [socket.id];
//         }
// 		console.log(3)
//         socketToRoom[socket.id] = roomID;
//         const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

//         socket.emit("all users", usersInThisRoom);
//     });

//     socket.on("sending signal", payload => {
// 		console.log(4)
//         io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
// 		console.log(5)
//     });

//     socket.on("returning signal", payload => {
// 		console.log(6)
//         io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
// 		console.log(7)
//     });

//     socket.on('disconnect', () => {
// 		console.log(8)
//         const roomID = socketToRoom[socket.id];
//         let room = users[roomID];
//         if (room) {
//             room = room.filter(id => id !== socket.id);
//             users[roomID] = room;
//         }
// 		console.log(9)
//     });

// });


// io.on("connection", (socket) => {
// 	console.log(1)
// 	socket.emit("me", socket.id);

// 	socket.on("disconnect", () => {
// 		console.log(2)
// 		socket.broadcast.emit("callEnded")
// 		console.log(3)
// 	});

// 	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
// 		console.log(4)
// 		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
// 		console.log(5)
// 	});

// 	socket.on("answerCall", (data) => {
// 		console.log(6)
// 		io.to(data.to).emit("callAccepted", data.signal)
// 		console.log(7)
// 	});
// });


// app.listen(3000, () => {
//   console.log("3000번 포트에서 대기중!");
// });

httpServer.listen(httpPort, ()=>{
	console.log('http서버가 켜졌어요 cicd ddd확인ddd');
});
// httpsServer.listen(httpsPort,() =>{
// 	console.log('https서버가 켜졌어요 ?')
// });