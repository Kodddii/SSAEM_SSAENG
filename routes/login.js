const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth-middleware');
const upload = require('../modules/multer');

const {
  signUp,
  emailCheck,
  nameCheck,
  login,
  getUser,
  myPwdCheck,
  editUser,
  profile,
  deleteProfile,
  mail,
  image
} = require("../controller/loginController")

//회원가입
router.post('/signUp', upload.single('userProfile'), signUp)

//이메일 중복 검사
router.post('/signUp/emailCheck', emailCheck)

//닉네임 중복 검사
router.post('/signUp/nameCheck', nameCheck)

//로그인
router.post('/login', login)

//유저 정보 불러오기
router.get('/login/getUser', middleware, getUser)

//자기소개 수정 비밀번호 체크
router.post('/mypage/pwdCheck', middleware, myPwdCheck)

//유저정보 수정
router.patch('/editUser', editUser)

//유저 프로필사진 업로드
router.post('/editUser/profile', upload.single('userProfile'), profile)

//유저 프로필사진 삭제
router.patch('/deleteProfile', deleteProfile)

// nodeMailer발송
router.post('/mail', mail) 

//이미지 파일 AWS S3 저장
router.post('/single', upload.single('userProfile'), image)

module.exports = router;