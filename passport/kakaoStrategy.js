// const res = require('express/lib/response');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const db = require('../config')
module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID, // 카카오 로그인에서 발급받은 REST API 키
        callbackURL: '/auth/kakao/callback', // 카카오 로그인 Redirect URI 경로
      },
      /*
      * clientID에 카카오 앱 아이디 추가
      * callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
      * accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰
      * profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
      */
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        // console.log('Token', accessToken, refreshToken);
        // console.log(profile._json && profile._json.kakao_account.email)
        // const param = [profile._json && profile._json.kakao_account.email, profile.displayName, false]
        try {
          const sql1 = 'SELECT * FROM Tutee WHERE userEmail=?'
          const sql2 = 'SELECT * FROM Tutee WHERE userEmail=?'
          db.query(sql1, [profile._json && profile._json.kakao_account.email], (err, data) => {
            if (data.length !== 0) {
              console.log(data, 'tutee 회원가입 되어있음!!!')
              done(null, data)
            } else {
              db.query(sql2, [profile._json && profile._json.kakao_account.email], (err, data) => {
                if (data.length !== 0) {
                  console.log(data, 'tutor 회원가입 되어있음!!!')
                  done(null, data)
                } else {
                  console.log('회원가입 XXXXXXXXX!!!')
                  data = [{
                    userEmail: profile._json && profile._json.kakao_account.email,
                    userName: profile.displayName,
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

        // const exUser = await User.findOne({ // 카카오 가입자 찾기.
        //   where: { userId: profile.id },
        //   // where: { userId: profile.id, provider: 'kakao' },
        // });
        // if (exUser) { // 가입자 있으면? 로그인 성공
        //   done(null, exUser);
        //   console.log('kakao 로그인 확인!!!')
        // } else { // 없으면? 생성 후 로그인 시키기
        //   const newUser = await User.create({
        //     // id - Number이며, 사용자의 kakao id
        //     // _json - 사용자 정보 조회로 얻은 json 원본 데이터
        //     tuteeId: profile.id,
        //     tuteeEmail: profile._json && profile._json.kakao_account.email,
        //     tuteeName: profile.displayName,
        //     // pwd: ,
        //     tuteeProfile: profile._json.properties.profile_image,
        //     // snsId: profile.id, // 새로 추가한 sns Id 컬럼
        //     // provider: 'kakao', // 새로 추가한 가입 출처 컬럼
        //   });
        //   done(null, newUser);
        // }
        // } catch (error) {
        //   console.error(error);
        //   done(error);
        // }
        // try {
        //   const exUser = await User.findOne({
        //     // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
        //     where: { snsId: profile.id, provider: 'kakao' },
        //   });
        //   // 이미 가입된 카카오 프로필이면 성공
        //   if (exUser) {
        //     done(null, exUser); // 로그인 인증 완료
        //   } else {
        //     // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
        //     const newUser = await User.create({
        //       // userId: profile._json && profile._json.kakao_account_email,
        //       userId: profile.id,
        //       nickname: profile.displayName,
        //       userId: profile.id,
        //       provider: 'kakao',
        //     });
        //     done(null, newUser); // 회원가입하고 로그인 인증 완료
        //   }
        // } catch (error) {
        //   console.error(error);
        //   done(error);
        // }
      },
    ),
  );
};