const express = require('express');
const router = express.Router();
const {User} = require('../models');
const {Op} = require('sequelize');
const jwt = require('jsonwebtoken');

//회원가입
router.post('/signUp', async (req, res) => {
  console.log(1);
  const {
    userEmail,
    pwd,
    pwdCheck,
    userName,
    isTutor,
    userProfile,
    tag,
    contents,
    startTime,
    endTime,
  } = req.body;
  console.log(2);
  //비밀번호 최소 문자 1, 숫자 1 포함 (8자리 이상) 정규식
  // const pwdValidation = /^(?=.*[A-Za-z])(?=.*\d)[\w]{8,}$/;

  // if (!pwdValidation.test(pwd)) {
  //   res.status(400).send({
  //     errorMessage: "비밀번호는 영문+숫자 조합으로 8자리 이상 사용해야합니다.",
  //   });
  //   return;
  // }
  if (pwd !== pwdCheck) {
    res.status(400).send({
      errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
    });
    return;
  }
  const existUser = await User.findAll({
    where: {
      [Op.or]: [{userName}, {userEmail}],
    },
  });
  if (existUser.length) {
    res.status(400).send({
      errorMessage: '이미 등록된 아이디 또는 이메일입니다.',
    });
    return;
  }
  await User.create({
    userEmail,
    pwd,
    userName,
    isTutor,
    userProfile,
    tag,
    contents,
    startTime,
    endTime,
  });
  res.status(201).send({});
});
console.log(3);
//아이디 중복 검사
router.post('/signUp/emailCheck', async (req, res) => {
  const existUser = await User.findAll({
    where: {userEmail},
  });
  if (existUser.length) {
    res.status(400).send({
      errorMessage: '이미 등록된 이메일입니다.',
    });
    return;
  }
});

//닉네임 중복 검사
router.post('/signUp/nameCheck', async (req, res) => {
  const existUser = await User.findAll({
    where: {userName},
  });

  if (existUser.length) {
    res.status(400).send({
      errorMessage: '이미 등록된 닉네임입니다.',
    });
    return;
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
  const {user} = res.locals;
  console.log(user);
  res.json(user);
});

//로그아웃
// router.get("/login/logOut", logOut);

//   //사용자 인증 미들웨어
//   const user = async (req, res) => {
//     const { user } = res.locals;
//     res.send({
//       user,
//     });
//     };
// });

module.exports = router;
