import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
const App = () => {
  const videoGrid = useRef();
  const myVideo = document.createElement("video");
  myVideo.muted = true;
  const peers = {};
  const roomId = "123";
  useEffect(() => {
    const peer = new Peer();
    const socket = io("https://jg-jg.shop");
    console.log(0);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        addVideoStream(myVideo, stream);
        console.log(1);
        // 상대방이 보낸 요청에 응답
        peer.on("call", (call) => {
          call.answer(stream); // 내 stream 보내주기
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream); // 상대방 stream 받아오기
            console.log(2);
          });
        });
        // 새로 들어 온 유저에게 call 요청
        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
          console.log(3);
        });
        // 유저랑 연결 끊겼을 때 다른 유저 stream을 close
        socket.on("user-disconnected", (userId) => {
          if (peers[userId]) peers[userId].close();
        });
        // 유저 들어 옴
        peer.on("open", (id) => {
          socket.emit("join-room", roomId, id);
          console.log(4);
        });
      });
    function connectToNewUser(userId, stream) {
      console.log(stream);
      const call = peer.call(userId, stream); // call 요청
      const video = document.createElement("video");
      console.log(video);
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream); // 상대방이 answer로 보낸 stream 받아오기
      });
      call.on("close", () => {
        video.remove();
      });
      peers[userId] = call;
    }
  }, []);
  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGrid.current.append(video);
  }
  return <div ref={videoGrid} />;
};
export default App;