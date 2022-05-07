require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs")
const http = require("http")
const https = require("https")
const SocketIO = require("socket.io")
const app_low = express();
const app = express();

//////////////////////////////////////////////////////////////////
// https 인증관련
const httpPort= 80;
const httpsPort = 443;
const privateKey = fs.readFileSync(__dirname + '/private.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '/certificate.crt', 'utf8');
const ca = fs.readFileSync(__dirname + '/ca_bundle.crt', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const httpServer = http.createServer(app_low);
const httpsServer = https.createServer(credentials,app)

// socket.io https 서버
const io = SocketIO(httpsServer, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});
/////////////////////////////////////////////////////////

// Router
const loginRouter = require("./routes/logins");
const reservationRouter = require("./routes/reservation")
const getLikeRouter = require("./routes/getLike")

// const helmet = require('helmet') 
// app.use(helmet());
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


// https 인증관련
app.get('/.well-known/pki-validation/69DCB230704B206B1161AA5BC7E57864.txt', (req,res)=>{
	res.sendFile(__dirname + '/well-known/pki-validation/69DCB230704B206B1161AA5BC7E57864.txt')
  });
app_low.use((req,res,next)=>{
	if(req.secure){
	  next();
	}else{
	  const to = `https://${req.hostname}:${httpsPort}${req.url}`;
	  console.log(to);
	  res.redirect(to)
	}
  })
//라우터 연결
app.use("/", loginRouter, reservationRouter,getLikeRouter);

// app.use(express.static("assets"));

// app.listen(3000, () => {
//   console.log("3000번 포트에서 대기중!");
// });

io.on("connection", (socket) => {
	console.log(1)
	// socket.emit("me", socket.id);
	socket.on('joinRoom',(roomName)=>{
		let rooms = io.sockets.adapter.rooms;
    	let room = rooms.get(roomName);
		console.log(2)
		
		if (room == undefined) {
			console.log(2.1)
			socket.join(roomName);
			socket.emit("created");
			console.log(2.2)
			
		  } else if (room?.size == 1) {
			  console.log(2.3)
			//room.size == 1 when one person is inside the room.
			socket.join(roomName);
			socket.emit("joined");
			console.log(2.4)
			
		  } else {
			//when there are already two people inside the room.
			socket.emit("full");
			console.log(2.5)
		  }
		  
		//   console.log(rooms);
		});
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});
	socket.on("ready", function (roomName) {
		socket.broadcast.to(roomName).emit("ready"); //Informs the other peer in the room.
	  });


	socket.on('sendingSignal',({signal, roomName})=>{
		console.log(3)
		console.log({signal,roomName})
		io.to(roomName).emit("offer",{signal, roomName, stream})
		console.log(3.5)
		
	  })
	//   socket.on(‘sendingSignal’,({signal, roomName})=>{
    //     console.log(3)
    //     io.to(roomName).emit(“offer”, {signal, roomName, stream})
    //     console.log(3.5)
    //   })

	  
	socket.on("returningSignal", ({ signal, roomName }) => {
		console.log({signal,roomName})
		console.log(4)
		io.to(roomName).emit("receivingSignal", signal)
		// io.to(roomName).emit("answer", { signal: signal});
		console.log(4.5)
	});
})





httpServer.listen(httpPort, ()=>{
	console.log('http서버가 켜졌어요');
  });
httpsServer.listen(httpsPort,() =>{
	console.log('https서버가 켜졌어요')
});