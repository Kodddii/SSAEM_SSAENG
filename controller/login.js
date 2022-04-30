const express = require("express");
const { User } = require("../models/user");
const { Op } = require("sequelize");
const router = express.Router();
const jwt = require("jsonwebtoken");

//회원가입
const signUp = async (req, res) => {
  console.log(1);
  const {
    userEmail,
    pwd,
    pwdCheck,
    userName,
    userType,
    userProfile,
    tag,
    contents,
  } = req.body;
  console.log(2);
  //비밀번호 최소 문자 1, 숫자 1 포함 (8자리 이상) 정규식
  const pwdValidation = /^(?=.*[A-Za-z])(?=.*\d)[\w]{8,}$/;

  if (!pwdValidation.test(pwd)) {
    res.status(400).send({
      errorMessage: "비밀번호는 영문+숫자 조합으로 8자리 이상 사용해야합니다.",
    });
    return;
  }
  if (pwd !== pwdCheck) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
    });
    return;
  }

  //아이디/닉네임 중복확인
  const existUser = await User.findAll({
    where: {
      [Op.or]: [{ userName }, { userEmail }],
    },
  });
  if (existUser.length) {
    res.status(400).send({
      errorMessage: "이미 등록된 아이디입니다.",
    });
    return;
  }

  //사용자 생성
  await User.create({
    userEmail,
    pwd,
    userName,
    userType,
    userProfile,
    tag,
    contents,
  });

  res.status(201).send({});
};

//로그인
const login = async (req, res) => {
  const { userEmail, pwd } = req.body;
  const user = await User.findOne({ where: { userEmail, pwd } });

  if (!user) {
    res.status(400).send({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
    });
    return;
  }
  const token = jwt.sign({ userId: user.uniqueUserid }, "m-s-k-j-w");
  res.send({
    token,
  });
};

//사용자 인증 미들웨어
const user = async (req, res) => {
  const { user } = res.locals;
  res.send({
    user,
  });
};

module.exports = { signUp, login, user };
