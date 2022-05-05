const express = require('express');
const res = require('express/lib/response');
const { CLIENT_FOUND_ROWS } = require('mysql/lib/protocol/constants/client');
const router = express.Router();
const db = require('../config');


// 예약
router.post('/addBooking/:userName',(req,res)=>{
    console.log(req.body)
    const {userName,start,end} = req.body;
    console.log(req.params)
    const Tutor_tutorName = req.params.userName
    const Tutee_tuteeName = userName
    const datas = [start,end,Tutor_tutorName,Tutee_tuteeName]

    const sql = 'INSERT INTO TimeTable (`startTime`,`endTime`,`Tutor_tutorName`,`Tutee_tuteeName`) VALUES (?,?,?,?)'

    db.query(sql,datas,(err,rows)=>{
        if (err) {
            console.log(err);
            res.status(201).send({ msg: 'fail' });
        } else {
            res.status(201).send({ msg: 'success' });
        }
    } )
})

// 선생님입장 예약된 리스트 불러오기 
router.get('/getBooking/?userName=tutorName&tuteeName',(req,res,next)=>{
    console.log(req.query)
    const tutorName = req.params.userName.split('&')[0]
    const tuteeName = req.params.userName.split('&')[1]
    const sql =`SELECT * FROM TimeTable WHERE Tutor_tutorName=${tutorName} ORDERED BY Tutor_tutorName  `
    db.query(sql, (err,data)=>{
        if(err) {
            console.log(err);
        }else{
            res.status(201).send({msg:'success', data})
        }
    })
})

// 예약리스트 개수 불러오기 
// router.get('/getBookingCnt',(req,res)=>{
//     const token = req.headers 

// })

// {
//     "userName":"tuteetest1",
//     "start":"Tue May 17 2022 12:00:00 GMT+0900",
//     "end":"Tue May 17 2022 13:00:00 GMT+0900"
// }
module.exports=router