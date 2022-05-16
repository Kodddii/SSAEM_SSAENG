require("moment-timezone")
const express = require('express');
const { type } = require('express/lib/response');
const res = require('express/lib/response');
const { CLIENT_FOUND_ROWS } = require('mysql/lib/protocol/constants/client');
const router = express.Router();
const db = require('../config');
const moment = require("moment")
moment.tz.setDefault("Asia/Seoul")


// 예약
router.post('/addBooking/:tutorName',(req,res)=>{
    
    const {end, start, userName} = req.body;
    console.log(req.body)
    console.log(req.params)
    const start2 = start.replace(' (한국 표준시)','')
    const end2= end.replace(' (한국 표준시)','')
    const tutorName = req.params.tutorName
    const datas = [start2,end2,tutorName,userName]

    const sql = 'INSERT INTO TimeTable (`start`,`end`,`Tutor_userName`,`Tutee_userName`) VALUES (?,?,?,?)'

    db.query(sql,datas,(err,rows)=>{
        if (err) {
            console.log(err);
            res.status(400).send({ msg: 'fail' });
        } else {
            res.status(201).send({ msg: 'success' });
        }
    })
})

//  예약된 리스트 불러오기 
router.get('/getBooking/',(req,res,)=>{
    console.log(req.query)
    const userId = req.query.userId
    const isTutor = req.query.isTutor
    const userName = req.query.userName
    console.log(typeof isTutor)
    if (isTutor==='1'){
        const sql1 ='SELECT * FROM TimeTable WHERE Tutor_userName=? ORDER BY Tutor_userName'
        db.query(sql1, userName, (err,datas1)=>{
        if(err) {
            console.log(err);
        }else{
            res.status(201).send({msg:'success', datas1})
        }
    })
    }else{
        const sql2 ='SELECT * FROM TimeTable WHERE Tutee_userName=? ORDER BY Tutee_userName'
        db.query(sql2, userName, (err,datas1)=>{
        if(err) {
            console.log(err);
        }else{
            res.status(201).send({msg:'success', datas1})
        }
    })
    }
    // const sql =`SELECT * FROM TimeTable WHERE Tutor_userName=? ORDER BY Tutor_userName  `
    // db.query(sql, tutorName,(err,data)=>{
    //     if(err) {
    //         console.log(err);
    //     }else{
    //         res.status(201).send({msg:'success', data})
    //     }
    // })
})

//예약리스트 개수 불러오기 
// router.get('/getBookingCnt',(req,res)=>{
//     const sql = `SELECT COUNT (*) FROM TimeTable`
//     db.query(sql,(err,data)=>{
//         if(err){
//             console.log(err)
//         }else{
//             console.log(data)
//             res.status(200).send({msg:'success', data})
//         }
//     })
// })
// })

// {
//     "userName":"tuteetest1",
//     "start":"Tue May 17 2022 12:00:00 GMT+0900",
//     "end":"Tue May 17 2022 13:00:00 GMT+0900"
// }
module.exports=router