const express = require('express');
const router = express.Router();
const res = require('express/lib/response');
const {CLIENT_FOUND_ROWS} = require('mysql/lib/protocol/constants/client');
const jwt = require('jsonwebtoken');
const db = require('../config');

//회원가입
router.post('/signUp', async (req, res) => {
  console.log(1);
  const {
    userEmail,
    userName,
    pwd,
    pwdCheck,
    isTutor,
    userProfile,
    tag,
    language1,
    language2,
    language3,
    comment,
    contents,
    startTime,
    endTime,
  } = req.body;
  console.log(2);
  //비밀번호 최소 문자 1, 숫자 1 포함 (8자리 이상) 정규식
  const pwdValidation = /^(?=.*[A-Za-z])(?=.*\d)[\w]{8,}$/;

  if (!pwdValidation.test(pwd)) {
    res.status(400).send({
      errorMessage: '비밀번호는 영문+숫자 조합으로 8자리 이상 사용해야합니다.',
    });
    return;
  }
  if (pwd !== pwdCheck) {
    res.status(400).send({
      errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
    });
    return;
  }

  // //userName 한글/영어대소문자/숫자/특문X(글자수: 6 ~ 20자 정규식
  // const nameValidation = /^(?=.*[A-Za-z])(?=.*\d)[\w]{8,}$/;

  // if (!pwdValidation.test(pwd)) {
  //   res.status(400).send({
  //     errorMessage:
  //       '닉네임은 한글/영어대소문자/숫자를 사용가능하며 글자수 6 ~ 20자로 설정해야합니다.',
  //   });
  //   return;
  // }

  if (isTutor === true) {
    const sql1 =
      'INSERT INTO Tutor (`userEmail`,`userName`,`pwd`,`isTutor`,`userProfile`,`tag`,`language1`,`language2`,`language3`,`comment`,`contents`,`startTime`,`endTime`) VALUES (?,?,?,?,?,?,?,?,?,?)';
    const datas1 = [
      userEmail,
      userName,
      pwd,
      isTutor,
      userProfile,
      tag,
      language1,
      language2,
      language3,
      comment,
      contents,
      startTime,
      endTime,
    ];
    db.query(sql1, datas1, (err, row) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({msg: 'success'});
      }
    });
  } else {
    const sql2 =
      'INSERT INTO Tutee (`userEmail`,`userName`,`pwd`,`isTutor`,`userProfile`,`tag`,`language1`,`language2`,`language3`,`comment`,`contents`,`startTime`,`endTime`) VALUES (?,?,?,?,?,?,?,?,?,?)';
    const datas2 = [
      userEmail,
      userName,
      pwd,
      isTutor,
      userProfile,
      tag,
      language1,
      language2,
      language3,
      comment,
      contents,
      startTime,
      endTime,
    ];
    db.query(sql2, datas2, (err, row) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({msg: 'success'});
      }
    });
  }
});
    

//이메일 중복 검사
router.post('/signUp/emailCheck', async (req, res) => {
  const {userEmail} = req.body;
   if (isTutor === true) {
     const sql1 = 'select * from Tutor where userEmail=?'
     db.query(sql1, [userEmail], (err, datas1) => {
       if (datas1.length === 0) {
            console.log(err);
            res.send({ msg: 'success' });
        } else {
            res.send({ msg: '이미 있는 이메일 주소입니다.' });
        }
      }
     )

    } else if (isTutor === false) {
     const sql2 = 'select * from Tutee where userEmail=?'

     db.query(sql2, [userEmail], (err, datas2) => {
       if (datas2.length === 0) {
            console.log(err);
            res.send({ msg: 'success' });
        } else {
            res.send({ msg: '이미 있는 이메일 주소입니다.'});
        }
     })
    }
  });
    

//닉네임 중복 검사
router.post('/signUp/nameCheck', async (req, res) => {
  const {userName} = req.body;
  if (isTutor === true) {
    const sql1 = 'select * from Tutor where userName=?';
    db.query(sql1, [userName], (err, datas1) => {
      if (datas1.length === 0) {
        console.log(err);
        res.send({msg: 'success'});
      } else {
        res.send({msg: '이미 있는 닉네임입니다.'});
      }
    });
  } else if (isTutor === false) {
    const sql2 = 'select * from Tutee where userName=?';
    db.query(sql2, [userName], (err, datas2) => {
      if (datas2.length === 0) {
        console.log(err);
        res.send({msg: 'success'});
      } else {
        res.send({msg: '이미 있는 닉네임입니다.'});
      }
    });
  }
});
    

   
    

//로그인
router.post('/login', async (req, res) => {
  // const login = async (req, res) => {
  const {userEmail, pwd} = req.body;
  const user = await User.findOne({where: {userEmail, pwd}});

  if (!user) {
    res.status(400).send({
      errorMessage: '아이디 또는 패스워드를 확인해주세요.',
    });
    return;
  }
  const token = jwt.sign({userId: user.userId}, 'my-secret-key');
  res.send({
    token,
  });
});

//유저 정보 불러오기
router.get('/login/getUser', (req, res) => {
  // 프론트에서 토큰을쓰는방법
  // 1. 로컬스토리지 => 토큰을 헤더에 담아서
  // req.headers
  // 2. 쿠키 => 아무요청을할때 항상 헤더에 토큰이 쿠키에담겨저
  // const abc = req.headers.cookies
  // abc = 'token=a;sdkfjsa;dfkj;dkf'
  // abc.split('=')[1]
  // verify userName
  const {user} = res.locals;
  console.log(user);
  res.json(user);
});

// //로그아웃
// router.get('/login/logOut', logOut);

//   //사용자 인증 미들웨어
//   const user = async (req, res) => {
//     const { user } = res.locals;
//     res.send({
//       user,
//     });
//     };
// });

module.exports = router;
