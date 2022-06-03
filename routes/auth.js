const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { Cookie } = require('express-session');
const jwt = require('jsonwebtoken');
const db = require('../config')
const router = express.Router();

//* 카카오로 로그인하기 라우터 ***********************
//? /kakao로 요청오면, 카카오 로그인 페이지로 가게 되고, 카카오 서버를 통해 카카오 로그인을 하게 되면, 다음 라우터로 요청한다.
router.get('/auth/kakao', passport.authenticate('kakao'));
//? 위에서 카카오 서버 로그인이 되면, 카카오 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
router.get(
  '/auth/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/fail', // kakaoStrategy에서 실패한다면 실행
  }),
  // kakaoStrategy에서 성공한다면 콜백 실행
  (req, res) => {
    const sql1 = 'SELECT * FROM Tutor WHERE userEmail=?';
    const sql2 = 'SELECT * FROM Tutee WHERE userEmail=?';
    console.log("req 정보!!!!!!!!!!!!", req.user)
    const userEmail = req.user[0].userEmail
    const userName = req.user[0].userName
    const token = jwt.sign({ userEmail }, process.env.JWT_SECRET)
    console.log(userEmail, userName, token)
    db.query(sql1, [userEmail], (err, data) => {
      if (data.length !== 0) {
        res.redirect('https://friengls.com/kakaoUser?token='+token)
      } else {
        db.query(sql2, [userEmail], (err, data) => {
          if (data.length !== 0) {
            res.redirect('https://friengls.com/kakaoUser?token='+token)
          } else {
            console.log('회원가입 XXXXXXXXX!!!')
            res.redirect('https://friengls.com/kakaoUser?userEmail='+userEmail+'&userName='+userName)
          }
        })
      }
    });
  },
);

//* 구글로 로그인하기 라우터 ***********************
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] })); // 프로파일과 이메일 정보를 받는다.
//? 위에서 구글 서버 로그인이 되면, 구글 redirect url 설정에 따라 이쪽 라우터로 오게 된다. 인증 코드를 박게됨
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const sql1 = 'SELECT * FROM Tutor WHERE userEmail=?';
    const sql2 = 'SELECT * FROM Tutee WHERE userEmail=?';
    console.log("req 정보!!!!!!!!!!!!", req.user)
    const userEmail = req.user[0].userEmail
    const userName = req.user[0].userName
    const token = jwt.sign({ userEmail }, process.env.JWT_SECRET)
    console.log(userEmail, userName, token)
    db.query(sql1, [userEmail], (err, data) => {
      if (data.length !== 0) {
        res.redirect('https://friengls.com/googleUser?token='+token)
      } else {
        db.query(sql2, [userEmail], (err, data) => {
          if (data.length !== 0) {
            res.redirect('https://friengls.com/googleUser?token='+token)
          } else {
            console.log('회원가입 XXXXXXXXX!!!')
            res.redirect('https://friengls.com/googleUser?userEmail='+userEmail+'&userName='+userName)
          }
        })
      }
    });
  },
);

module.exports = router;