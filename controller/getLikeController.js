const db = require('../config');


// like 
const like = (req,res)=>{
    const user = res.locals.user
    const {tutorName} = req.body;
    // Tutor는 like 불가
    if(user.isTutor===1){
        res.status(400).send({msg:'fail'})
        return;
    }
    if(user.userName===tutorName) {
        res.status(400).send({msg:'fail'})
        return;
    }
    const sql0 = 'SELECT * FROM `Like` WHERE Tutee_userName=? AND Tutor_userName=?'
    const sql1 =  'UPDATE Tutor SET `like` = `like` + 1 WHERE userName=?'
    const answerData = [user.userName, tutorName]
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
            const data2 = [user.userName,tutorName]
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

}

// unlike
const unlike = (req,res)=>{
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
}

// getPopularTutor
const getPopularTutor = (req,res)=>{
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
}

// getTutor Tutor 검색페이지 리스트
const getTutor = (req,res)=>{
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
}

// getTutor by Tag
const getTutorTag = (req,res)=>{
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
}

// getTag 튜터마다 갖고있는 태그들 모아서 20개 랜덤으로 뿌려주기
const getTag = (req,res)=>{
    const sql = 'SELECT tag FROM Tutor '
    db.query(sql,(err,data)=>{
        if(err) console.log(err)
        else{
            // console.log(data)
            let arr =[]
            for (let x of data){
                arr.push(x.tag)
            }
            // tag값 하나씩 잘라주기
            let arr2 = arr.join(',').split(',')
            let arr3 =[]
            // arr2 값들 하나씩 trim해서 새 배열에 넣어주기
            for(let x of arr2){
                arr3.push(x.trim())
                }   
            // 배열내 인자들 shuffle함수
            function shuffle(array) {
                array.sort(() => Math.random() - 0.5);
                }
            // shuffle
            shuffle(arr3)
            // 배열내 중복값 제거
            const arr4 = arr3.filter((element, index) => {
                return arr3.indexOf(element) === index;
            });
            // 배열 내 length=0 인 인자들 제거
            const arr5 = arr4.filter(el => el.length>0)
            // 배열에서 20개까지만 추출
            const arr6 = arr5.slice(0,20)
            
            res.status(200).send(arr6)
        }
    })
}

// 유저상세페이지
const getUserDetail = (req,res)=>{
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
}
// 좋아요한 선생님리스트, 자신을 좋아요한 학생리스트
const getLikeList = (req,res)=>{
    const user = res.locals.user
    if(user.isTutor===1){
     
        const sql = 'SELECT T.userName, T.userProfile FROM `Tutee` T LEFT OUTER JOIN `Like` L ON  T.userName = L.Tutee_userName WHERE L.Tutor_userName=?;'
        db.query(sql,user.userName,(err,data)=>{
            if(err){
                console.log(err)
                res.status(400).send({msg:'fail'})
            }else{
                res.status(200).send(data)
            }
        })    
    }else if(user.isTutor===0){
        const sql = 'SELECT T.userName, T.userProfile FROM `Tutor` T LEFT OUTER JOIN `Like` L ON  T.userName = L.Tutor_userName WHERE L.Tutee_userName=?';
        db.query(sql,user.userName,(err,data)=>{
            if(err){
                console.log(err)
                res.status(400).send({msg:'fail'})
            }else{
                res.status(200).send(data)
            }
        }) 
    }
}

// isLike : 좋아요 리스트에 추가되어있는지 판별해주는 API
const isLike = (req,res)=>{
    
    const userName = res.locals.user.userName
    const isTutor = res.locals.user.isTutor
    if(isTutor === 1){
        res.status(400).send({msg:'error'})
        return;
    }
    const {tutorName} = req.params
    const sql0 = 'SELECT * FROM `Like` WHERE Tutee_userName=? and Tutor_userName=?'
    const answerData = [ userName, tutorName ]
    db.query(sql0, answerData, (err,data)=>{
        console.log(data)
        if(err){
            console.log(err)
            res.status(400).send({msg:"fail"})
        }else if (data.length){
            
            res.status(200).send({isLike:true})
        }else if (!data.length){
            res.status(200).send({isLike:false})
        }
    })
}


module.exports = {
    like,
    unlike,
    getPopularTutor,
    getTutor,
    getTutorTag,
    getTag,
    getUserDetail,
    getLikeList,
    isLike,
}