const express = require('express');
const router = express.Router();
const {Tutor} = require('../models');
const {Tutee} = require('../models');
const {Op} = require('sequelize');
const jwt = require('jsonwebtoken');
const middleware = require('../middlewares/auth-middleware');

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
  if (isTutor === true) {
    const tutorEmail = userEmail;
    const tutorName = userName;
    const tutorProfile = userProfile;
    console.log(3);
    await Tutor.create({
      tutorEmail,
      tutorName,
      pwd,
      pwdCheck,
      isTutor,
      tutorProfile,
      tag,
      language1,
      language2,
      language3,
      comment,
      contents,
      startTime,
      endTime,
    });
    console.log(4);
  } else {
    const tuteeEmail = userEmail;
    const tuteeName = userName;
    const tuteeProfile = userProfile;
    await Tutee.create({
      tuteeEmail,
      tuteeName,
      pwd,
      pwdCheck,
      isTutor,
      tuteeProfile,
      tag,
      language1,
      language2,
      language3,
      comment,
      contents,
      startTime,
      endTime,
    });
  }
  res.status(201).send({});
});
// const existTutor = await Tutor.findAll({
//   where: {
//     [Op.or]: [{tutorName}, {tutorEmail}],
//   },
// });
// if (existTutor.length) {
//   res.status(400).send({
//     errorMessage: '이미 등록된 아이디 또는 이메일입니다.',
//   });
//   return;
// }
// await Tutor.create({
//   tutorEmail,
//   pwd,
//   tutorName,
//   isTutor,
//   tutorProfile,
//   tag,
//   language1,
//   language2,
//   language3,
//   comment,
//   contents,
//   startTime,
//   endTime,
// });
// res.status(201).send({});

console.log(3);

//아이디 중복 검사
router.post('/signUp/emailCheck', async (req, res) => {
  const {userEmail} = req.body;
  const existTutor = await Tutor.findAll({
    where: {
      [Op.or]: [{userEmail: tutorEmail}],
    },
  });
  const existTutee = await Tutee.findAll({
    where: {
      [Op.or]: [{userEmail: tuteeEmail}],
    },
  });
  if (existTutor.length || existTutee.length) {
    res.status(400).send({
      errorMessage: '이미 등록된 이메일입니다.',
    });
    return;
  } else {
    res.status(200).send({
      ok: '사용 가능한 이메일입니다.',
    });
  }

  // else {
  //   res.status(200).send({
  //     ok: '사용 가능한 이메일입니다.',
  //   });
  // }

  // const {tuteeEmail} = req.body;
  // const {existTutee} = await Tutee.findAll({
  //   where: {tuteeEmail},
  // });
  // if (existTutee.length) {
  //   res.status(400).send({
  //     errorMessage: '이미 등록된 이메일입니다.',
  //   });
  //   return;
  // } else {
  //   res.status(200).send({
  //     ok: '사용 가능한 이메일입니다.',
  //   });
  // }
});

//닉네임 중복 검사
router.post('/signUp/nameCheck', async (req, res) => {
  const {userName} = req.body;
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
router.get('/login/getUser', middleware, (req, res) => {
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
