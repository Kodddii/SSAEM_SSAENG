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


// 예약
router.post('/addBooking/:tutorName',(req,res)=>{
    
    const {end, start, userName} = req.body;
    console.log(req.body)
    console.log(req.params)
    const start2 = start.replace(' (한국 표준시)','')
    const end2= end.replace(' (한국 표준시)','')
    const tutorName = req.params.tutorName
    const datas = [start2,end2,tutorName,userName]
    const sql0 = 'SELECT * FROM TimeTable WHERE start=? AND end=? AND Tutor_userName=? AND Tutee_userName=?'
    const sql = 'INSERT INTO TimeTable (`start`,`end`,`Tutor_userName`,`Tutee_userName`) VALUES (?,?,?,?)'
    db.query(sql0 , datas, (err,rows)=>{
        if(err){
            console.log(err)
        }else if (rows.length){
            res.status(400).send({msg:'이미 예약되어있는 시간입니다.'})
        }else if (!rows.length){
            db.query(sql,datas,(err,rows)=>{
                if (err) {
                    console.log(err);
                    res.status(400).send({ msg: 'fail' });
                } else {
                    res.status(201).send({ msg: 'success' });
                }
            })
        }
    })
    
})

// router.post('/addBooking/:tutorName',(req,res)=>{
    
//     const {end, start, userName} = req.body;
//     console.log(req.body)
//     console.log(req.params)
//     for(let x of data){
//         const sql = 'SELECT * FROM TimeTable WHERE '
//     }


//     const start2 = start.replace(' (한국 표준시)','')
//     const end2= end.replace(' (한국 표준시)','')
//     const tutorName = req.params.tutorName
//     const datas = [start2,end2,tutorName,userName]

//     const sql = 'INSERT INTO TimeTable (`start`,`end`,`Tutor_userName`,`Tutee_userName`) VALUES (?,?,?,?)'

//     db.query(sql,datas,(err,rows)=>{
//         if (err) {
//             console.log(err);
//             res.status(400).send({ msg: 'fail' });
//         } else {
//             res.status(201).send({ msg: 'success' });
//         }
//     })
// })





//  예약된 리스트 불러오기 
router.get('/getBooking/',(req,res,)=>{
    console.log(req.query)
    const userId = req.query.userId
    const isTutor = req.query.isTutor
    const userName = req.query.userName
    console.log(typeof isTutor)
    if (isTutor==='1'){
        const sql1 ='SELECT * FROM TimeTable WHERE Tutor_userName=? '
        db.query(sql1, userName, (err,datas0)=>{
        if(err) {
            console.log(err);
        }else{
            // 데이터 값 시간순 정렬
            const datas1  = datas0.sort((a,b) => new moment(a.start).format('x') - new moment(b.start).format('x'))
            res.status(201).send({msg:'success', datas1})
        }
    })
    }else if(isTutor==='0'){
        const sql2 ='SELECT * FROM TimeTable WHERE Tutee_userName=?'
        db.query(sql2, userName, (err,datas0)=>{
        if(err) {
            console.log(err);
        }else{
            const datas1  = datas0.sort((a,b) => new moment(a.start).format('x') - new moment(b.start).format('x'))
            res.status(201).send({msg:'success', datas1})
        }
    })
    }
})

// 알림용 예약리스트 불러오기 
router.get('/getNoti', authMiddleware,(req,res)=>{
    const user = res.locals.user
    
    if(user.isTutor === 1){
        const sql = 'SELECT * FROM TimeTable WHERE Tutor_userName=? AND (TutorNoti = ? OR TutorDel=?) ORDER BY createdAt DESC'
        db.query(sql,[user.userName,1,1],(err,data)=>{
            if(err) console.log(err)
            else{
                // const data  = data0.sort((a,b) => new moment(a.start).format('x') - new moment(b.start).format('x'))
                res.status(200).send(data);
            }
        })
    }else if(user.isTutor===0){
        const sql = 'SELECT * FROM TimeTable WHERE Tutee_userName=? AND ( TuteeNoti = ? OR  TuteeDel=?) ORDER BY createdAt DESC'
        db.query(sql,[user.userName,1,1],(err,data)=>{
            if(err) console.log(err);
            else{
                // const data  = data0.sort((a,b) => new moment(a.start).format('x') - new moment(b.start).format('x'))
                res.status(200).send(data)
            }
        })
    }
})
// 알림용 리스트에서 삭제
router.patch('/delNoti/',authMiddleware, (req,res)=>{
    const user = res.locals.user
    console.log(req.query)
    const {timeId} =req.query
    if(user.isTutor===1){
        const sql = 'UPDATE TimeTable SET TutorNoti = ?  WHERE timeId=? '
        const answer = [0,parseInt(timeId)]
        db.query(sql,answer, (err,data)=>{
            if(err) {
                console.log(err);
                res.status(400).send({msg:'update failed'})
            }
            else{
                res.status(200).send({msg:'update success!'});
            }
        }) 
    }else if(user.isTutor===0){
        const sql = 'UPDATE TimeTable SET TuteeNoti = ?  WHERE timeId=? '
        const answer = [0,parseInt(timeId)]
        db.query(sql,answer, (err,data)=>{
            if(err) {
                console.log(err);
                res.status(400).send({msg:'update fail'})
            }
            else{
                res.status(200).send({msg:'update success!'});
            }
        }) 
    }
})

// 예약 취소하기
router.patch('/delBooking/', authMiddleware,(req,res)=>{
    const user = res.locals.user
    const {timeId} = req.query
    if(user.isTutor===1){
        const sql = 'UPDATE TimeTable SET TuteeDel = ? WHERE timeId =? '
        const answer = [1,parseInt(timeId)]
        db.query(sql, answer, (err,data)=>{
            if(err){
                console.log(err);
                res.status(400).send({msg:'fail'})
            } 
            else{
                res.status(200).send({msg:'success'})
            }
        })
    }else if(user.isTutor===0){
        const sql = 'UPDATE TimeTable SET TutorDel = ? WHERE timeId =? '
        const answer = [1,parseInt(timeId)]
        db.query(sql, answer, (err,data)=>{
            if(err){
                console.log(err);
                res.status(400).send({msg:'fail'})
            } 
            else{
                res.status(200).send({msg:'success'})
            }
        })
    }
})

// 예약 취소 삭제 확정
router.delete('/delBookingCheck/', authMiddleware, (req,res)=>{
    const user = res.locals.user
    const {timeId} = req.query
    const sql = 'DELETE FROM TimeTable WHERE timeId=?'
    db.query(sql, parseInt(timeId), (err,data)=>{
        if(err) console.log(err);
        else{
            res.status(200).send({msg:'Delete complete'})
        }
    })
})

// 알림 전체제거
router.patch('/delAllNoti',authMiddleware,(req,res)=>{
    const user = res.locals.user;
    console.log(req.body)
    const timeIdArray = req.body;
    for (let timeId of timeIdArray){
        const sql = 'UPDATE TimeTable SET noti = ? WHERE timeId=?'
        const answer = [0,parseInt(timeId)]
        db.query(sql,answer,(err,data)=>{
            if(err) console.log(err)
        })
    }
    res.status(200).send({msg:'success'})
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