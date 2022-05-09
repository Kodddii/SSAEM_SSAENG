const express = require('express');
const router = express.Router();
const res = require('express/lib/response');
const middleware = require('../middlewares/auth-middleware');
const {CLIENT_FOUND_ROWS} = require('mysql/lib/protocol/constants/client');
const jwt = require('jsonwebtoken');
const db = require('../config.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;



//회원가입
router.post('/signUp', async (req, res) => {
  console.log(1);
  const {
    userEmail,
    userName,
    pwd,
    pwdCheck,
    isTutor,
    userProfile,
    tag,
    language1,
    language2,
    language3,
    comment,
    contents,
    startTime,
    endTime,
  } = req.body;
  console.log(2);
  
  //비밀번호 최소 문자 1, 숫자 1 포함 (8자리 이상) 정규식
  const pwdValidation = /^(?=.*[A-Za-z])(?=.*\d)[\w]{8,}$/;

  if (!pwdValidation.test(pwd)) {
    res.status(400).send({
      errorMessage: '비밀번호는 영문+숫자 조합으로 8자리 이상 사용해야합니다.',
    });
    return;
  }
  if (pwd !== pwdCheck) {
    res.status(400).send({
      errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
    });
    return;
  }
                    
  // //userName 한글/영어대소문자/숫자/특문X(글자수: 6 ~ 20자 정규식
  // const nameValidation = /^(?=.*[A-Za-z])(?=.*\d)[\w]{8,}$/;

  // if (!pwdValidation.test(pwd)) {
  //   res.status(400).send({
  //     errorMessage:
  //       '닉네임은 한글/영어대소문자/숫자를 사용가능하며 글자수 6 ~ 20자로 설정해야합니다.',
  //   });
  //   return;
  // }

  if (isTutor) {
    const sql1 =
      'INSERT INTO Tutor (`userEmail`,`userName`,`pwd`,`isTutor`,`userProfile`,`tag`,`language1`,`language2`,`language3`,`comment`,`contents`,`startTime`,`endTime`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const datas1 = [
      userEmail,
      userName,
      pwd,
      isTutor,
      userProfile,
      tag,
      language1,
      language2,
      language3,
      comment,
      contents,
      startTime,
      endTime,
    ];
    console.log(22)
    bcrypt.hash(datas1[2], saltRounds, (err, hash) => {
    if (err){
      console.log(err)
    } else {
       datas1[2] = hash;
    }
    console.log(3)

    db.query(sql1, datas1, (err, row) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({msg: 'success'});
      }
    });
  })
    
  } else {
    console.log(4)
    const sql2 =
      'INSERT INTO Tutee (`userEmail`,`userName`,`pwd`,`isTutor`,`userProfile`,`tag`,`language1`,`language2`,`language3`,`comment`,`contents`,`startTime`,`endTime`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const datas2 = [
      userEmail,
      userName,
      pwd,
      isTutor,
      userProfile,
      tag,
      language1,
      language2,
      language3,
      comment,
      contents,
      startTime,
      endTime,
    ];
    console.log(5)
    bcrypt.hash(datas2[2], saltRounds, (err, hash) => {
    if (err){
      console.log(err)
    } else {
      console.log(datas2[2])
       datas2[2] = hash;
       
    }
    console.log(6)

    db.query(sql2, datas2, (err, row) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({msg: 'success'});
      }
    });
  }) 
}
})
    

//이메일 중복 검사
router.post('/signUp/emailCheck', async (req, res) => {
  const {userEmail} = req.body;
  const sql1 = 'SELECT * FROM Tutor WHERE userEmail=?';
  const sql2 = 'SELECT * FROM Tutee WHERE userEmail=?';
  db.query(sql1, userEmail, (err, datas1) => {
    if (err) {
      console.log(err);
    } else {
      if (!datas1.length) {
        db.query(sql2, userEmail, (err, datas2) => {
          if (!datas2.length) {
            res.send({msg: 'success'});
          } else {
            res.send({msg: '이미 있는 이메일 주소입니다.'});
          }
        });
      } else {
        res.send({msg: '이미 있는 이메일 주소입니다.'});
      }
    }
  });
});


//닉네임 중복 검사
router.post('/signUp/nameCheck', async (req, res) => {
  const {userName} = req.body;
  const sql1 = 'SELECT * FROM Tutor WHERE userName=?';
  const sql2 = 'SELECT * FROM Tutee WHERE userName=?';
  db.query(sql1, userName, (err, datas1) => {
    if (err) {
      console.log(err);
    } else {
      if (!datas1.length) {
        db.query(sql2, userName, (err, datas2) => {
          if (!datas2.length) {
            res.send({msg: 'success'});
          } else {
            res.send({msg: '이미 있는 닉네임입니다.'});
          }
        });
      } else {
        res.send({msg: '이미 있는 닉네임입니다.'});
      }
    }
  });
});
  

//로그인
router.post('/login', async (req, res) => {
  const {userEmail, pwd} = req.body
  // const info = [req.body.userEmail, req.body.pwd];
  // console.log(info)
  const sql1 = 'SELECT * FROM Tutor WHERE userEmail=?';
  const sql2 = 'SELECT * FROM Tutee WHERE userEmail=?';

  db.query(sql1, userEmail, (err, datas1) => {
    if (err) console.log(err);
    if(datas1.length){
            console.log(datas1)
            // console.log(datas1[0].pwd)
            bcrypt.compare(pwd, datas1[0].pwd, (err,result) => {
              if (result) {
                const userInfo = {
                  isTutor: datas1[0].isTutor,
                  userName: datas1[0].userName,
                };
                const token = jwt.sign(
                                { userName: datas1[0].userName },
                                process.env.JWT_SECRET,
                            );
                res.send({ msg: 'success', token, userInfo });
            } else {
              console.log('pwd err');
              res.send({ msg: '로그인 실패' });
            }
            });
    }else{
      db.query(sql2, userEmail, (err, datas2) => {
        if (err) console.log(err);
        
        if (datas2.length) {
          bcrypt.compare(pwd, datas2[0].pwd, (err, result) => {
            if (result) {
              const userInfo = {
                isTutor: datas2[0].isTutor,
                userName: datas2[0].userName,
              };
              const token = jwt.sign(
                { userName: datas2[0].userName },
                process.env.JWT_SECRET,
                );
              res.send({msg: 'success', token, userInfo});
            } else {
              console.log('여기다여기');
              res.send({msg: '로그인 실패'});
            }
          });
        } else {
        console.log('Id not found');
        res.send({ msg: 'login failed' });
        }
      }
     ) 
    }
  })
});



//유저 정보 불러오기
router.get('/login/getUser', middleware, async (req, res) => {
  const { user } = res.locals;
  console.log(user.userName);
  res.send({
    userName: user.userName,
    isTutor: user.isTutor,
    userProfile: user.userProfile,
    tag: user.tag,
    comment: user.comment,
  });
});


// 유저정보 수정
router.patch('/editUser', async (req, res) => {
  //  const userId = res.locals.userId;
   const { userEmail, userName, pwd, isTutor, tag, language1, language2, language3, comment, contents, startTime, endTime } = req.body;
   if (isTutor) {  //수정하려는 사람이 보내준 값이 isTutor: true일때,
      const sql = 'SELECT * FROM Tutee WHERE userEmail=?' //Tutee 테이블에서 userEmail로 조회함
      console.log("튜티테이블에 있는지 조회함")
      db.query(sql, [userEmail], (err, rows) => {
      if (rows.length !== 0) {  
        console.log("튜티데이블에 있다!!!")                          //if Tutee테이블에 있던 유저가 Tutor테이블로 이동하고 싶은거면
      const sql2 = 'INSERT INTO Tutor (`userEmail`,`userName`,`pwd`,`isTutor`,`tag`,`language1`,`language2`,`language3`,`comment`,`contents`,`startTime`,`endTime`) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
      db.query(sql2, [userEmail, userName, isTutor, tag, language1, language2, language3, comment, contents, startTime, endTime], (err, row) => {
        if (err) {
          console.log(err)
        } else {
           console.log("윤하짱짱")
        res.status(200).send({msg: 'success'})
        }
     })                                                    //Tutor 테이블로 Insert해줌
    console.log("선생님테이블에 저장하라고")
                                                      
  } else {                                              //else Tutor 테이블에 이미 있는 유저가 추가정보만 수정하고 싶은거면
    const sql1 =
      'UPDATE Tutor SET userName=?, isTutor=?, tag=?, language1=?, language2=?, language3=?, comment=?, contents=?, startTime=?, endTime=? WHERE userEmail=?'
                                                          //Tutor 테이블에서 추가정보만 업데이트해준다
    db.query(sql1, [userName, isTutor, tag, language1, language2, language3, comment, contents, startTime, endTime, userEmail], (err, row) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({msg: 'success'});
      }
    }); 
  }
 })
 } else {    //else 수정하려는 사람이 보내준 값이 isTutor: false일때,(Tutee로 수정하고싶은 사람은 무조건 Tutee여야 함.)
    const sql2 =
      'UPDATE Tutee SET userName=?, isTutor=?, tag=?, language1=?, language2=?, language3=?, comment=?, contents=?, startTime=?, endTime=? WHERE userEmail=?'
                                                      //Tutee테이블에서 추가정보를 업데이트해준다
    db.query(sql2, [userName, isTutor, tag, language1, language2, language3, comment, contents, startTime, endTime, userEmail], (err, row) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({msg: 'success'});
      }
    });
   }
 })
    

//필수정보 수정(pwd)









//   }const sql1 = 'UPDATE Tutor SET userName WHERE userName=?'
//       db.query(sql1, userName, (err, datas1) => {
//         if (err) console.log(err);
//     if(datas1.length){
//       res.locals.user = datas1[0];
//       next();
//     };
//   });
//     const sql2 = 'UPDATE Tutor SET userName WHERE userName=?'
//       db.query(sql2, userName, (err, datas2) => {
//         if (err) console.log(err);
//     if(datas2.length){
//       res.locals.user = datas2[0];
//       next();
//     };
//   });
//  }  
// )

// //로그아웃
// router.get('/login/logOut', logOut);

//   //사용자 인증 미들웨어
//   const user = async (req, res) => {
//     const { user } = res.locals;
//     res.send({
//       user,
//     });
//     };
// });

module.exports = router;





























// const express = require('express');
// const router = express.Router();
// const {User} = require('../models');
// const {Op} = require('sequelize');
// const jwt = require('jsonwebtoken');

// //회원가입
// //db.query(sql,data,(err,row))




// router.post('/signUp', async (req, res) => {
//   console.log(1);
//   const {userEmail,pwd,pwdCheck,userName,
//     isTutor,userProfile,tag,contents,startTime,endTime,
//   } = req.body;
//   // if(isTutor){
//     // await Tutor.create({
//     //   userEmail,
//     //   pwd,
//     //   userName,
//     //   isTutor,
//     //   userProfile,
//     //   tag,
//     //   contents,
//     //   startTime,
//     //   endTime,
//     // });
//   //}
//   console.log(2);
//   //비밀번호 최소 문자 1, 숫자 1 포함 (8자리 이상) 정규식
//   const pwdValidation = /^(?=.*[A-Za-z])(?=.*\d)[\w]{8,}$/;

//   if (!pwdValidation.test(pwd)) {
//     res.status(400).send({
//       errorMessage: '비밀번호는 영문+숫자 조합으로 8자리 이상 사용해야합니다.',
//     });
//     return;
//   }
//   if (pwd !== pwdCheck) {
//     res.status(400).send({
//       errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
//     });
//     return;
//   }
//   const existUser = await User.findAll({
//     where: {
//       [Op.or]: [{userName}, {userEmail}],
//     },
//   });
//   if (existUser.length) {
//     res.status(400).send({
//       errorMessage: '이미 등록된 아이디 또는 이메일입니다.',
//     });
//     return;
//   }
//   await User.create({
//     userEmail,
//     pwd,
//     userName,
//     isTutor,
//     userProfile,
//     tag,
//     contents,
//     startTime,
//     endTime,
//   });
//   res.status(201).send({});
// });
// console.log(3);

// //아이디 중복 검사
// router.post('/signUp/emailCheck', async (req, res) => {
//   const {userEmail} = req.body;
//   const existUser = await User.findAll({
//     where: {userEmail},
//   });
//   if (existUser.length) {
//     res.status(400).send({
//       errorMessage: '이미 등록된 이메일입니다.',
//     });
//     return;
//   }
// });

// //닉네임 중복 검사
// router.post('/signUp/nameCheck', async (req, res) => {
//   const {userName} = req.body;
//   const existUser = await User.findAll({
//     where: {userName},
//   });
 
//   if (existUser1.length) {
//     res.status(400).send({
//       errorMessage: '이미 등록된 닉네임입니다.',
//     });
//     return;
//   }
// });

// //로그인
// router.post('/login', async (req, res) => {
//   // const login = async (req, res) => {
//   const {userEmail, pwd} = req.body;
//   const user = await User.findOne({where: {userEmail, pwd}});

//   if (!user) {
//     res.status(400).send({
//       errorMessage: '아이디 또는 패스워드를 확인해주세요.',
//     });
//     return;
//   }
//   const token = jwt.sign({userId: user.userId}, 'my-secret-key');
//   res.send({
//     token,
//   });
// });

// //유저 정보 불러오기
// router.get('/login/getUser', (req, res) => {
//   // 프론트에서 토큰을쓰는방법
//   // 1. 로컬스토리지 => 토큰을 헤더에 담아서
//   // req.headers
//   // 2. 쿠키 => 아무요청을할때 항상 헤더에 토큰이 쿠키에담겨저
//   // const abc = req.headers.cookies
//   // abc = 'token=a;sdkfjsa;dfkj;dkf'  
//   // abc.split('=')[1]
//   // verify userName 
//   const {user} = res.locals;
//   console.log(user);
//   res.json(user);
// });

// // //로그아웃
// // router.get('/login/logOut', logOut);

// //   //사용자 인증 미들웨어
// //   const user = async (req, res) => {
// //     const { user } = res.locals;
// //     res.send({
// //       user,
// //     });
// //     };
// // });

// module.exports = router;