const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config')
module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID, // 구글 로그인에서 발급받은 REST API 키
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback', // 구글 로그인 Redirect URI 경로
      },
      async (access_token, refreshToken, profile, email, done) => {
        console.log('google profile : ', profile, email);
        console.log(email._json.email, email.displayName)
        // const param = [email._json.email, email.displayName, false]
        try {
          const sql1 = 'SELECT * FROM Tutee WHERE userEmail=?'
          const sql2 = 'SELECT * FROM Tutee WHERE userEmail=?'
          db.query(sql1, [email._json.email], (err, data) => {
            if (data.length !== 0) {
              console.log(data, 'tutee 회원가입 되어있음!!!')
              done(null, data)
            } else {
              db.query(sql2, [email._json.email], (err, data) => {
                if (data.length !== 0) {
                  console.log(data, 'tutor 회원가입 되어있음!!!')
                  done(null, data)
                } else {
                  console.log('회원가입 XXXXXXXXX!!!')
                  data = [{
                    userEmail: email._json.email,
                    userName: email.displayName,
                  }]
                  done(null, data)
                }
              })
            }
          });
        } catch (error) {
          console.error(error);
          done(error);
        }        
      },
    ),
  );
};