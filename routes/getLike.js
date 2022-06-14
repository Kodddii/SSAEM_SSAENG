const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware')
const router = express.Router();
const db = require('../config');
const res = require('express/lib/response');
const { query } = require('../config');
const {
    like,
    unlike,
    getPopularTutor,
    getTutor,
    getTutorTag,
    getTag,
    getUserDetail,
    getLikeList,
    isLike,
} = require("../controller/getLikeController")

// Like
router.patch('/like',authMiddleware, like)

// unlike
router.patch('/unlike',authMiddleware, unlike)

// getPopularTutor  12개
router.get('/getPopularTutor', getPopularTutor)

// getTutor
router.get('/getTutor', getTutor)

// getTutor with keyword
router.get('/getTutorTag/', getTutorTag)

// getTag 튜터마다 갖고 있는 태그값들 랜덤으로 뿌려주기
router.get('/getTag', getTag)

// 유저상세페이지
router.get('/getUserDetail/', getUserDetail)
// 좋아요한 선생님리스트, 자신을 좋아요한 학생리스트
router.get('/getLikeList',authMiddleware, getLikeList)

// isLike : 좋아요 리스트에 추가되어있는지 판별해주는 API
router.get('/isLike/:tutorName', authMiddleware, isLike)





module.exports=router