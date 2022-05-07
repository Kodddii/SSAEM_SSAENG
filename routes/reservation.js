const express = require('express');
const res = require('express/lib/response');
const { CLIENT_FOUND_ROWS } = require('mysql/lib/protocol/constants/client');
const router = express.Router();
const db = require('../config');


// 예약
router.post('/addBooking/',(req,res)=>{
   
    const {userName,start,end} = req.body;
    const Tutor_tutorName= req.query.userName
    // const Tutor_tutorName = req.params.userName
    const Tutee_tuteeName = userName
    const datas = [start,end,Tutor_tutorName,Tutee_tuteeName]

    const sql = 'INSERT INTO TimeTable (`startTime`,`endTime`,`Tutor_userName`,`Tutee_userName`) VALUES (?,?,?,?)'

    db.query(sql,datas,(err,rows)=>{
        if (err) {
            console.log(err);
            res.status(400).send({ msg: 'fail' });
        } else {
            res.status(201).send({ msg: 'success' });
        }
    } )
})

//  예약된 리스트 불러오기 
router.get('/getBooking/',(req,res,)=>{
    console.log(req.query)
    const userName = req.query.userName
    const isTutor = req.query.isTutor
    if (isTutor){
        const sql1 =`SELECT * FROM TimeTable WHERE Tutor_userName=? ORDER BY Tutor_userName  `
        db.query(sql1, userName, (err,datas1)=>{
        if(err) {
            console.log(err);
        }else{
            res.status(201).send({msg:'success', data1})
        }
    })
    }else{
        const sql2 =`SELECT * FROM TimeTable WHERE Tutee_userName=? ORDER BY Tutee_userName  `
        db.query(sql2, userName, (err,data2)=>{
        if(err) {
            console.log(err);
        }else{
            res.status(201).send({msg:'success', data2})
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
router.get('/getBookingCnt',(req,res)=>{
    const sql = `SELECT COUNT (*) FROM TimeTable`
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err)
        }else{
            console.log(data)
            res.status(200).send({msg:'success', data})
        }
    })
})
// })

// {
//     "userName":"tuteetest1",
//     "start":"Tue May 17 2022 12:00:00 GMT+0900",
//     "end":"Tue May 17 2022 13:00:00 GMT+0900"
// }
module.exports=router