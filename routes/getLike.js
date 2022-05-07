const express = require('express');

const router = express.Router();
const db = require('../config');

// Like
router.patch('/like',(req,res)=>{
    // const token = req.headers;
    console.log(req.body)
    const {userName ,tutorName} = req.body;
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
    // const token = req.headers;
    console.log(req.body)
    const {userName ,tutorName} = req.body;
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

// router.get('/')


module.exports=router