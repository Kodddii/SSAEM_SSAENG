const express = require('express');
const auth = require('../middlewares/auth-middleware')
const router = express.Router();
const db = require('../config');
const res = require('express/lib/response');

// Like
router.patch('/like',auth,(req,res)=>{
    const userName = res.locals.user.userName
    console.log(req.body)
    const {tutorName} = req.body;
    const sql1 =  'UPDATE Tutor SET `like` = `like` + 1 WHERE userName=?'
    db.query(sql1,tutorName,(err,rows1)=>{
        if(err){
            console.log(err)
        }else{
            console.log('success')
        }
    })
    const sql2 = 'INSERT INTO `Like` (`Tutee_userName`,`Tutor_userName`) VALUES (?,?)'
    const data2 = [userName,tutorName]
    db.query(sql2, data2, (err2,rows2)=>{
        if(err2){
            res.status(400).send({msg:'fail'})
            console.log(err2)
        }else{
            res.status(200).send({msg:'success'})
            console.log(rows2)
        }
    })
})

// unlike
router.patch('/unlike',(req,res)=>{
    const userName = user.userName
    console.log(req.body)
    const {tutorName} = req.body;
    const sql1 =  'UPDATE Tutor SET `like` = `like` - 1 WHERE userName=?'
    db.query(sql1,tutorName,(err,rows1)=>{
        if(err){
            console.log(err)
        }else{
            console.log('success')
        }
    })
    const sql2 = 'DELETE FROM `Like` WHERE Tutee_userName=? AND Tutor_userName=?'
    // DELETE FROM [Table명] WHERE [Field명] = [조건 값]


    const data2 = [userName,tutorName]
    db.query(sql2, data2, (err2,rows2)=>{
        if(err2){
            res.status(400).send({msg:'fail'})
            console.log(err2)
        }else{
            res.status(200).send({msg:'success'})
            console.log(rows2)
        }
    })
})
// getPopularTutor 
router.get('/getPopularTutor',(req,res)=>{
    const sql = 'SELECT * FROM `Tutor` ORDER BY `like` DESC'
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err)
            res.status(400).send({msg:'fail'})
        }else{
            res.status(200).send({msg:'success', data})
        }
    })

})
// getTutor
router.get('/getTutor',(req,res)=>{
    const sql = 'SELECT * FROM `Tutor`'
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err)
            res.status(400).send({msg:'fail'})
        }else{
            res.status(200).send({msg:'success',data})
        }
    })
})




// 튜터검색
router.get('/getTutor/', (req,res)=>{
    const {keyword}= req.query
    

})



// 유저상세페이지
router.get('/getUserDetail/', (req,res)=>{
    const{userId,isTutor} = req.query
    console.log(userId)
    console.log(typeof userId)
    if(isTutor==='1'){
        const sql1 = 'SELECT * FROM `Tutor` WHERE userId=?'
        db.query(sql1, parseInt(userId), (err,data)=>{
            if(err){
                console.log(err)
                res.status(400).send({msg:'fail'})
            }else{
                res.status(200).send({msg:'success',data})
            }
        })
    }else{
        const sql2 = 'SELECT * FROM `Tutee` WHERE userId=?'
        db.query(sql2, parseInt(userId), (err,data2)=>{
            if(err){
                console.log(err)
                res.status(400).send({msg:'fail'})  
            }else{
                res.status(200).send({msg:'success', data2})
            }
        })


    }



    // const sql = 

})








module.exports=router