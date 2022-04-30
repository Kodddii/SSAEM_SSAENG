const express = require("express");
const router = express.Router();
const {
  signUp,
  idCheck,
  nameCheck,
  getUser,
  logOut,
} = require("../controller/login");
const authMiddleware = require("../middlewares/auth-middleware");

//회원가입
router.post("/signUp", signUp);

//아이디 중복 검사
router.post("/login/idCheck", idCheck);

//이름 중복 검사
router.post("/login/nameCheck", nameCheck);

//로그인
router.post("/login", login);

//유저 정보 불러오기
router.get("/login/getUser", authMiddleware, (req, res) => {
  const { user } = res.locals;
  console.log(user);
  res.json(user);
});

//로그아웃
router.get("/login/logOut", logOut);

// 사용자 인증
// router.get("/users/me", middleswares, user);

module.exports = router;
