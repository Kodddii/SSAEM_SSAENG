const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const { User } = require('../models');
module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID, // 구글 로그인에서 발급받은 REST API 키
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback', // 구글 로그인 Redirect URI 경로
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('google profile : ', profile);
        try {
          const exUser = await User.findOne({ // 카카오 가입자 찾기.
            where: { userId: profile.id },
            // where: { userId: profile.id, provider: 'kakao' },
          });
          if (exUser) { // 가입자 있으면? 로그인 성공
            done(null, exUser);
            console.log('google 로그인 확인!!!')
          } else { // 없으면? 생성 후 로그인 시키기
            console.log('google 회원가입 성공!!!')
            const newUser = await User.create({
              // id - Number이며, 사용자의 kakao id
              // _json - 사용자 정보 조회로 얻은 json 원본 데이터
              userId: profile.id,
              userEmail: profile._json.email,
              userName: profile.displayName,
              userProfile: profile._json.picture,
              // snsId: profile.id, // 새로 추가한 sns Id 컬럼
              // provider: 'google', // 새로 추가한 가입 출처 컬럼
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
        // try {
        //   const exUser = await User.findOne({
        //     // 구글 플랫폼에서 로그인 했고 & snsId필드에 구글 아이디가 일치할경우
        //     where: { snsId: profile.id, provider: 'google' },
        //   });
        //   // 이미 가입된 구글 프로필이면 성공
        //   if (exUser) {
        //     done(null, exUser); // 로그인 인증 완료
        //   } else {
        //     // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
        //     const newUser = await User.create({
        //       email: profile?.email[0].value,
        //       nickname: profile.displayName,
        //       userProfile: profile.id,
        //       provider: 'google',
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