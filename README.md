# Friengls

</br>

<img width="100%" src="https://friengles.s3.ap-northeast-2.amazonaws.com/1654227512001">

<h3 align='center'> 👩‍🏫 1 : 1 화상 한국어 교육 플랫폼, Friengls 🙋‍♂️ </h3>
  
</br>

## 🛠 기술스택
<p align='center'>
  <img src='https://img.shields.io/badge/Node-v16.13.1-339933?logo=Node.js'/>
  <img src='https://img.shields.io/badge/NPM-CB3837?logo=npm'/>
  <img src='https://img.shields.io/badge/socket.io-v4.4.1-white?logo=Socket.io'/>
  <img src="https://img.shields.io/badge/Express-v4.17.3-009688?logo=Express&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-v8.0.23-4479a1?logo=MySQL&logoColor=white" />
  </br>
  <img src="https://img.shields.io/badge/WebRTC-333333?logo=WebRTC&logoColor=white" />
  <img src="https://img.shields.io/badge/Passport-v0.5.2-34E27A?logo=Passport&logoColor=white" />
  <img src="https://img.shields.io/badge/Json Web Token-v8.5.1-8a8a8a?logo=JSON Web Tokens&logoColor=white" />
  </br></br>
  Deploy
  </br></br>
  <img src="https://img.shields.io/badge/Git hub-000000?logo=Github&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub Actions-4479a1?logo=GitHub Actions&logoColor=#2088FF" />
  
</p>

</br>

## 📌 바로가기

- <a href="https://friengls.com/"> 👉Friengls </a></br>

</br>

## 🗺 Architecture
![architecture-BE](https://friengles.s3.ap-northeast-2.amazonaws.com/1654228419513)

</br>

## ⛓ ERD
![ERD](https://friengles.s3.ap-northeast-2.amazonaws.com/1654228534789)

</br>

## 🤼‍♂️ Contributors
|name|position|github|
|------|---|---|
|홍준기🔰|Node.js|https://github.com/Kodddii|
|김윤하|Node.js|https://github.com/ivryxx|
|배정민|Node.js|https://github.com/jeongminGit|

</br>

## 💣 트러블 슈팅 & 기술적 도전
#### - WebRTC
1. 도입 이유
* webRTC를 구현하기 위해  peer to peer 방식을 선택
* 서버는 socket.io 라이브러리를 활용해  클라이언트간 시그널링만 주관. 
* 스트림정보같은 데이터 교환은 클라이언트에서 수행
2. 문제상황: Load Balancing을 구축했을때 소켓요청이 ec2 두개로 나뉘어지면서 시그널링이 제대로 되지않아
페이지 접속시 화상채팅 연결이 한번에 되지않는 현상 발생

3. 해결 방안
* 소켓서버 선언시 롱폴링조건을 제거해 소켓요청 해결
* 소켓통신을 로드밸런서가 아닌 EC2로 직접 연결 

4. 해결
* 소켓서버 선언시 cors 내 롱폴링조건을 제거했으나 여전히 화상채팅 연결이 불안정. 
* 소켓통신을 로드밸런서가 아닌 한 ec2로 직접 연결시켜 담당하게함
* 화상채팅 연결 성공

#### - 소셜 로그인 (kakao, Google)
1. 배경: 로그인 시 매번 아이디, 비밀번호를 타이핑 해야 하는 번거로움을 최소화하기 위해 소셜 로그인 구현.
2. 문제상황: 서비스 중 정보 수정 인증 과정 중에 회원가입 시 등록한 패스워드를 사용하는데,
passport(kakao, google)로 회원가입 시 provider(kakao, google)에게 제공 받은 정보로만 회원가입이 진행되어 회원정보 수정 서비스를 이용하지 못 하는 상황 발생
3. 해결방안 
* passport(kakao, google)로 회원가입 시 바로 회원가입을 진행하지 않고 provider(kakao, google)에게 필요한 정보(이메일, 닉네임)만 받아와서 사이트 내 회원가입 절차(패스워드 받아옴)를 진행함. 
* 로그인 시에는 kakao로 로그인, google로 로그인 버튼만 누르면 자동 로그인 진행

## ⏰ 프로젝트 기간

|||
|:------:|---|
|총 기간| 4월 22일 ~ 6월 3일 (6주)|
|배포일| 5월 29일|
|서비스 개선| 5월 29일 ~ 6월 3일|
