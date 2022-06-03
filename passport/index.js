// 인증 전략 등록 및 데이터 저장 or 불러올 때 사용되는 파일

const passport = require('passport');
const kakao = require('./kakaoStrategy'); // 카카오서버로 로그인할때
const google = require('./googleStrategy'); // 구글서버로 로그인할때
const db = require('../config.js');

require('dotenv').config();

module.exports = () => {
  passport.serializeUser((data, done) => {
    done(null, data);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  kakao();
  google();
};