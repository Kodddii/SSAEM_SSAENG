require("moment-timezone")
const express = require('express');
const { type } = require('express/lib/response');
const res = require('express/lib/response');
const { CLIENT_FOUND_ROWS } = require('mysql/lib/protocol/constants/client');
const router = express.Router();
const db = require('../config');
const moment = require("moment");
const authMiddleware = require("../middlewares/auth-middleware");
const { time } = require("console");
moment.tz.setDefault("Asia/Seoul")

const  {
    addBooking, 
    getBooking, 
    getNoti,
    delNoti,
    delBooking,
    delBookingCheck,
    delAllNoti,
} = require("../controller/reservationController")

// 예약
router.post('/addBooking/:tutorName', addBooking)


//  예약된 리스트 불러오기 
router.get('/getBooking/', getBooking)

// 알림용 예약리스트 불러오기 
router.get('/getNoti', authMiddleware, getNoti)
// 알림용 리스트에서 삭제
router.patch('/delNoti/',authMiddleware, delNoti)

// 예약 취소하기
router.patch('/delBooking/', authMiddleware, delBooking)

// 예약 취소 삭제 확정
router.delete('/delBookingCheck/', authMiddleware, delBookingCheck)

// 알림 전체제거
router.patch('/delAllNoti',authMiddleware, delAllNoti)


module.exports=router