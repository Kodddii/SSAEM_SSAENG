const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware')
const router = express.Router();
const db = require('../config');
const res = require('express/lib/response');

// Like
router.patch('/like',authMiddleware,(req,res)=>{
    const userName = res.locals.user.userName
    console.log(req.body)
    const {tutorName} = req.body;
    const sql0 = 'SELECT * FROM `Like` WHERE Tutee_userName=? AND Tutor_userName=?'
    const answerData = [userName, tutorName]
    db.query(sql0, answerData , (err,data0)=>{
        if(err) {
            console.log(err)

        }else if(data0.length){
            res.status(400).send({msg: '이미 like한 Tutor 입니다'})
        }else{
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
        }
    })




    const sql1 =  'UPDATE Tutor SET `like` = `like` + 1 WHERE userName=?'



    // db.query(sql1,tutorName,(err,rows1)=>{
    //     if(err){
    //         console.log(err)
    //     }else{
    //         console.log('success')
    //     }
    // })
    // const sql2 = 'INSERT INTO `Like` (`Tutee_userName`,`Tutor_userName`) VALUES (?,?)'
    // const data2 = [userName,tutorName]
    // db.query(sql2, data2, (err2,rows2)=>{
    //     if(err2){
    //         res.status(400).send({msg:'fail'})
    //         console.log(err2)
    //     }else{
    //         res.status(200).send({msg:'success'})
    //         console.log(rows2)
    //     }
    // })
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
            console.log(data)
            res.status(200).send({msg:'success',data})
        }
    })
})




// getTutor with keyword
router.get('/getTutorTag/', (req,res)=>{
    const {keyword}= req.query
    const data  = `%${keyword}%`
    const dataArr= [data,data,data,data]
    const sql =
        'SELECT * FROM Tutor WHERE userName LIKE ? OR tag LIKE ? OR comment LIKE ? OR contents LIKE ?;'
    db.query(sql, dataArr, (err,datas)=>{
        if(err){
            console.log(err)
        }else{
            res.status(200).send(datas)
        }
    })

})

// getTag
router.get('/getTag', (req,res)=>{
    const sql = 'SELECT tag FROM Tutor '
    db.query(sql,(err,data)=>{
        if(err) console.log(err)
        else{
            console.log(data)
            let arr =[]
            for (let x of data){
                arr.push(x.tag)
            }
            let arr2 = arr.join(',').split(',')
            let arr3 =[]
            for(let x of arr2){
            arr3.push(x.trim())
            }
            function shuffle(array) {
            array.sort(() => Math.random() - 0.5);
            }
            shuffle(arr3)
            const arr4 = arr3.filter((element, index) => {
                return arr3.indexOf(element) === index;
            });
            res.status(200).send(arr4)
        }
    })
})






// 유저상세페이지
router.get('/getUserDetail/', (req,res)=>{
    const{userName,isTutor} = req.query
    console.log(userName)
    if(isTutor==='1'){
        const sql1 = 'SELECT * FROM `Tutor` WHERE userName=?'
        db.query(sql1, userName, (err,data)=>{
            if(err){
                console.log(err)
                res.status(400).send({msg:'fail'})
            }else{
                res.status(200).send({msg:'success',data})
            }
        })
    }else{
        const sql2 = 'SELECT * FROM `Tutee` WHERE userName=?'
        db.query(sql2, userName, (err,data2)=>{
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