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
    const sql1 =  'UPDATE Tutor SET `like` = `like` + 1 WHERE userName=?'
    const answerData = [userName, tutorName]
    db.query(sql0, answerData , (err,data0)=>{
        if(err) {
            console.log(err)

        }else if(data0.length){
            console.log(data0.length)
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
router.patch('/unlike',authMiddleware,(req,res)=>{
    const userName = res.locals.user.userName
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
router.get('/isLike', (req,res)=>{
    const sql  = 'SELECT * FROM Like '


})





// getPopularTutor  12개
router.get('/getPopularTutor',(req,res)=>{
    const sql = 'SELECT userId,userName,userEmail,isTutor,userProfile,tag,contents,startTime,endTime,comment,language1,language2,language3,`like` FROM `Tutor` ORDER BY `like` DESC'
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err)
            res.status(400).send({msg:'fail'})
        }else{
            // console.log(data)
            res.status(200).send({msg:'success', data})
        }
    })
})
// getTutor
router.get('/getTutor',(req,res)=>{
    const sql = 'SELECT userId,userName,userEmail,isTutor,userProfile,tag,contents,startTime,endTime,comment,language1,language2,language3,`like` FROM Tutor' 
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err)
            res.status(400).send({msg:'fail'})
        }else{
            // console.log(data)
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
        'SELECT userId,userName,userEmail,isTutor,userProfile,tag,contents,startTime,endTime,comment,language1,language2,language3,`like` FROM Tutor WHERE userName LIKE ? OR tag LIKE ? OR comment LIKE ? OR contents LIKE ?;'
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
            // console.log(data)
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
            const arr5 = arr4.filter(el => el.length>0)

            const arr6 = arr5.slice(0,8)
            
            res.status(200).send(arr6)
        }
    })
})






// 유저상세페이지
router.get('/getUserDetail/', (req,res)=>{
    const{userName,isTutor} = req.query
    if(isTutor==='1'){
        const sql1 = 'SELECT userId,userName,userEmail,isTutor,userProfile,tag,contents,startTime,endTime,comment,language1,language2,language3,`like` FROM `Tutor` WHERE userName=?'
        db.query(sql1, userName, (err,data)=>{
            if(err){
                console.log(err)
                res.status(400).send({msg:'fail'})
            }else{
                res.status(200).send({msg:'success',data})
            }
        })
    }else if(isTutor==='0'){
        const sql2 = 'SELECT userId,userName,userEmail,isTutor,userProfile,tag,contents,startTime,endTime,comment,language1,language2,language3 FROM `Tutee` WHERE userName=?'
        db.query(sql2, userName, (err,data)=>{
            if(err){
                console.log(err)
                res.status(400).send({msg:'fail'})  
            }else{
                res.status(200).send({msg:'success', data})
            }
        })
    }
})
// 자신이 좋아요한 선생님 리스트
router.get('/getLikeList',authMiddleware,(req,res)=>{
    const userName = res.locals.user.userName



})

router.get('/isLike/:tutorName', authMiddleware,(req,res)=>{
    const userName = res.locals.user.userName
    const {tutorName} = req.params.tutorName;
    const sql0 = 'SELECT * FROM `Like` WHERE Tutee_userName=? AND Tutor_userName=?'
    const answerData = [userName, tutorName]
    db.query(sql0, answerData, (err,data)=>{
        if(err){
            console.log(err)
            res.status(400).send({msg:"fail"})
        }else if (data.length){
            res.status(200).send({isLike:true})
        }else if (!data.length){
            res.status(200).send({isLike:false})
        }
    })
})





module.exports=router