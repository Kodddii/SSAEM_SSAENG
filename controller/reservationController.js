require("moment-timezone")
const db = require("../config")
const moment = require("moment");
moment.tz.setDefault("Asia/Seoul")
//예약
const addBooking = (req,res)=>{
    const {end, start, userName} = req.body;
    try {
        const bookingMoment = new moment()
        const startMoment = moment(start)
        const time = moment.duration(startMoment.diff(bookingMoment)).asMinutes()
        console.log(time)
        if(time<60){
            res.status(400).send({msg:'수업시작 1시간 전까지만 예약가능합니다.'})
            return;
        }
        const start2 = start.replace(' (대한한국 표준시)','')
        const end2= end.replace(' (대한한국 표준시)','')
        const tutorName = req.params.tutorName
        const datasAddbooking = [start2,end2,tutorName,userName]
        const sqlCheckTime = 'SELECT * FROM TimeTable WHERE start=? AND end=? AND Tutor_userName=? AND Tutee_userName=?'
        const sqlAddBooking = 'INSERT INTO TimeTable (`start`,`end`,`Tutor_userName`,`Tutee_userName`) VALUES (?,?,?,?)'
        const sqlUpdateCnt = 'UPDATE Tutee SET `bookingCnt`= `bookingCnt`+1 WHERE userName=?'
        const sqlSelectCnt = 'SELECT bookingCnt FROM Tutee WHERE userName=?'
        const ansSql = userName
        // 하루 5회이상 예약했는지 체크
        db.query(sqlSelectCnt , ansSql, (err,data)=>{
            if(err) console.log(err)
            else if(data[0].bookingCnt>5){
                res.status(400).send({msg:'하루에 5타임이상 예약할수 없습니다.'})
            }else{
                // cnt 체크후 이미 예약되어있는 시간인지 확인
                db.query(sqlCheckTime , datasAddbooking, (err,rows)=>{
                    if(err){
                        console.log(err)
                    }else if (rows.length){
                        res.status(400).send({msg:'이미 예약되어있는 시간입니다.'})
                    }else if (!rows.length){
                        // cnt체크, 시간중복 확인 후 db에 예약테이블 insert
                        db.query(sqlAddBooking,datasAddbooking,(err,rows)=>{
                            if (err) {
                                console.log(err);
                                res.status(400).send({ msg: 'fail' });
                            } else {
                                db.query(sqlUpdateCnt,ansSql,(err,data)=>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                        console.log('update success')
                                    }
                                })
                                res.status(201).send({ msg: 'success' });
                            }
                        })
                        
                    }
                })
            }
        })

        
    } catch (error) {
        
    }
}

// 예약된 리스트 불러오기
const getBooking = (req,res)=>{
    console.log(req.query)
    const userId = req.query.userId
    const isTutor = req.query.isTutor
    const userName = req.query.userName
    console.log(typeof isTutor)
    if (isTutor==='1'){
        // tutor일때 tutor table에서 예약리스트 불러오기
        const sql1 ='SELECT * FROM TimeTable WHERE Tutor_userName=? '
        db.query(sql1, userName, (err,datas0)=>{
        if(err) {
            console.log(err);
        }else{
            // 예약리스트 데이터 값 시간순 정렬
            const datas1  = datas0.sort((a,b) => new moment(a.start).format('x') - new moment(b.start).format('x'))
            res.status(201).send({msg:'success', datas1})
        }
    })
    }else if(isTutor==='0'){
        // tutee 일때 tutee table에서 예약리스트 불러오기
        const sql2 ='SELECT * FROM TimeTable WHERE Tutee_userName=?'
        db.query(sql2, userName, (err,datas0)=>{
        if(err) {
            console.log(err);
        }else{
            // 예약리스트 데이터 값 시간순 정렬
            const datas1  = datas0.sort((a,b) => new moment(a.start).format('x') - new moment(b.start).format('x'))
            res.status(201).send({msg:'success', datas1})
        }
    })
    }
}

// 알림용 예약리스트 불러오기
// Noti = 1 or Del = 1 인 데이터 불러오기
const getNoti = (req,res)=>{
    const user = res.locals.user
    // 튜터 알림리스트
    if(user.isTutor === 1){
        const sql = 'SELECT * FROM TimeTable WHERE Tutor_userName=? AND (TutorNoti = ? OR TutorDel=?) ORDER BY createdAt DESC'
        db.query(sql,[user.userName,1,1],(err,data)=>{
            if(err) console.log(err)
            else{
                // const data  = data0.sort((a,b) => new moment(a.start).format('x') - new moment(b.start).format('x'))
                res.status(200).send(data);
            }
        })
    // 튜티 알림리스트
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
}

// 알림 리스트에서 삭제 (확인된 알림 Noti = 0 으로 수정)
const delNoti = (req,res)=>{
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
}

// 예약 취소하기
const delBooking = (req,res)=>{
    const user = res.locals.user
    const {timeId} = req.query
    if(user.isTutor===1){
        const sql0 = 'SELECT start FROM TimeTable WHERE timeID =?'
        db.query(sql0, timeId, (err,data)=>{
            if(err){
                console.log(err)
                return;
            }
            // 예약시간 한시간 전까지만 취소가능하도록 설정 
            const moment = require("moment")
            const startTime=moment(data[0].start);
            const cancelMoment = new moment();
            const time = moment.duration(startTime.diff(cancelMoment)).asMinutes()
            if(time<60){
                res.status(400).send({msg:'예약취소는 한시간 전까지만 가능합니다.'})
            }else if(time>=60){
                // 한시간 전 확인 후 Del 값 1로 변경
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
            }    
        })
        
    }else if(user.isTutor===0){
        const sql0 = 'SELECT start FROM TimeTable WHERE timeID =?'
        db.query(sql0,timeId, (err,data)=>{
            if(err){
                console.log(err);
                res.status(400).send({msg:'에러입니다'})
            }
            const moment = require("moment")
            const startTime=moment(data[0].start);
            const cancelMoment = new moment();
            const time = moment.duration(startTime.diff(cancelMoment)).asMinutes()
            if(time<60){
                res.status(400).send({msg:'예약취소는 한시간 전까지만 가능합니다.'})
            }else if(time>=60){
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
    }
}

// 예약 취소 삭제 확정 (예약취소 알림 확인 후 db에서 제거)
const delBookingCheck = (req,res)=>{
    const user = res.locals.user
    const {timeId} = req.query
    const sql = 'DELETE FROM TimeTable WHERE timeId=?'
    db.query(sql, parseInt(timeId), (err,data)=>{
        if(err) console.log(err);
        else{
            res.status(200).send({msg:'Delete complete'})
        }
    })
}

// 알림전체제거 (사용자 알림 전체 제거)
const delAllNoti = (req,res)=>{
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
}
module.exports ={ 
    addBooking, 
    getBooking, 
    getNoti,
    delNoti,
    delBooking,
    delBookingCheck,
    delAllNoti,
}