# Friengls

</br>

<img width="100%" src="https://friengles.s3.ap-northeast-2.amazonaws.com/1654227512001">

<h3 align='center'> π©βπ« 1 : 1 νμ νκ΅­μ΄ κ΅μ‘ νλ«νΌ, Friengls πββοΈ </h3>
  
</br>

## π  κΈ°μ μ€ν
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

## π λ°λ‘κ°κΈ°

- <a href="https://friengls.kr/"> π Friengls </a></br>
- <a href="https://youtu.be/u_SaGn2HHXw"> π¬ νλ‘μ νΈ λ°νμμ </a></br>

</br>

## πΊ Architecture
![architecture-BE](https://friengles.s3.ap-northeast-2.amazonaws.com/1654228419513)

</br>

## β ERD
![ERD](https://friengles.s3.ap-northeast-2.amazonaws.com/1654228534789)

</br>

## π€ΌββοΈ Contributors
|name|position|github|
|------|---|---|
|νμ€κΈ°π°|Node.js|https://github.com/Kodddii|
|κΉμ€ν|Node.js|https://github.com/ivryxx|
|λ°°μ λ―Ό|Node.js|https://github.com/jeongminGit|

</br>

## π£ νΈλ¬λΈ μν & κΈ°μ μ  λμ 
#### - WebRTC
1. λμ μ΄μ 
* webRTCλ₯Ό κ΅¬ννκΈ° μν΄  peer to peer λ°©μμ μ ν
* μλ²λ socket.io λΌμ΄λΈλ¬λ¦¬λ₯Ό νμ©ν΄  ν΄λΌμ΄μΈνΈκ° μκ·Έλλ§λ§ μ£Όκ΄. 
* μ€νΈλ¦Όμ λ³΄κ°μ λ°μ΄ν° κ΅νμ ν΄λΌμ΄μΈνΈμμ μν
2. λ¬Έμ μν©: Load Balancingμ κ΅¬μΆνμλ μμΌμμ²­μ΄ ec2 λκ°λ‘ λλμ΄μ§λ©΄μ μκ·Έλλ§μ΄ μ λλ‘ λμ§μμ
νμ΄μ§ μ μμ νμμ±ν μ°κ²°μ΄ νλ²μ λμ§μλ νμ λ°μ

3. ν΄κ²° λ°©μ
* μμΌμλ² μ μΈμ λ‘±ν΄λ§μ‘°κ±΄μ μ κ±°ν΄ μμΌμμ²­ ν΄κ²°
* μμΌν΅μ μ λ‘λλ°Έλ°μκ° μλ EC2λ‘ μ§μ  μ°κ²° 

4. ν΄κ²°
* μμΌμλ² μ μΈμ cors λ΄ λ‘±ν΄λ§μ‘°κ±΄μ μ κ±°νμΌλ μ¬μ ν νμμ±ν μ°κ²°μ΄ λΆμμ . 
* μμΌν΅μ μ λ‘λλ°Έλ°μκ° μλ ν ec2λ‘ μ§μ  μ°κ²°μμΌ λ΄λΉνκ²ν¨
* νμμ±ν μ°κ²° μ±κ³΅

#### - μμ λ‘κ·ΈμΈ (kakao, Google)
1. λ°°κ²½: λ‘κ·ΈμΈ μ λ§€λ² μμ΄λ, λΉλ°λ²νΈλ₯Ό νμ΄ν ν΄μΌ νλ λ²κ±°λ‘μμ μ΅μννκΈ° μν΄Β μμ λ‘κ·ΈμΈ κ΅¬ν.
2. λ¬Έμ μν©: μλΉμ€ μ€ μ λ³΄ μμ  μΈμ¦ κ³Όμ  μ€μ νμκ°μ μ λ±λ‘ν ν¨μ€μλλ₯Ό μ¬μ©νλλ°,
passport(kakao, google)λ‘ νμκ°μ μ provider(kakao, google)μκ² μ κ³΅ λ°μ μ λ³΄λ‘λ§ νμκ°μμ΄ μ§νλμ΄ νμμ λ³΄ μμ  μλΉμ€λ₯Ό μ΄μ©νμ§ λͺ» νλ μν© λ°μ
3. ν΄κ²°λ°©μ 
* passport μ λ΅μΌλ‘ νμκ°μ μ μ°¨λ₯Ό μ§ννμ§ μκ³  providerμκ² νμν μ λ³΄(μ΄λ©μΌ, λλ€μ)λ§ λ°μμ μ¬μ΄νΈ λ΄ νμκ°μ μ μ°¨(ν¨μ€μλ μλ ₯)λ₯Ό μ§νν¨. 
* λ‘κ·ΈμΈ μμλ kakaoλ‘ λ‘κ·ΈμΈ, googleλ‘ λ‘κ·ΈμΈ λ²νΌλ§ λλ₯΄λ©΄ μλ λ‘κ·ΈμΈ μ§ν

## β° νλ‘μ νΈ κΈ°κ°

|||
|:------:|---|
|μ΄ κΈ°κ°| 4μ 22μΌ ~ 6μ 3μΌ (6μ£Ό)|
|λ°°ν¬μΌ| 5μ 29μΌ|
|μλΉμ€ κ°μ | 5μ 29μΌ ~ 6μ 3μΌ|
