const express = require('express');
const router = express.Router();
const db = require('../config');
const middleware = require('../middlewares/auth-middleware');

// 리뷰 전체 불러오기(메인화면)
router.get('/getReview', async (req, res) => {
  const sql = "SELECT R.*, TU.userProfile AS Tutee_userProfile, TT.userProfile AS Tutor_userProfile FROM `Review` R LEFT OUTER JOIN `Tutee` TU ON R.Tutee_userName = TU.userName LEFT OUTER JOIN `Tutor` TT ON R.Tutor_userName = TT.userName ORDER BY R.createdAt DESC LIMIT 5"
  db.query(sql, (err, data) => {
    if (err) {
      console.log(err);
      res.send({ msg: 'fail' });
    } else {
      count = data.length
      console.table(data)
      console.log(count)
      res.send({ data, count });
    }
  })
})

// 리뷰 불러오기(조회)
router.get('/getReview/:tutor_userName', async (req, res) => {
  const { tutor_userName } = req.params;
  console.log(tutor_userName);
  const sql = "SELECT R.*, TU.userProfile AS Tutee_userProfile, TT.userProfile AS Tutor_userProfile FROM `Review` R LEFT OUTER JOIN `Tutee` TU ON R.Tutee_userName = TU.userName LEFT OUTER JOIN `Tutor` TT ON R.Tutor_userName = TT.userName WHERE Tutor_userName=? ORDER BY R.createdAt DESC"
  db.query(sql, tutor_userName, (err, data) => {
    if (err) {
      console.log(err)
      res.send({ msg: 'fail' })
    } else {
      count = data.length
      console.table(data)
      console.log(count)
      res.send(data)
    }
  })
});

// 리뷰 작성
router.post('/addReview', middleware, async (req, res) => {
  const tutee_userName = res.locals.user.userName;
  const { userName, rate, text } = req.body;
  console.log(tutee_userName, req.body);
  const param = [userName, tutee_userName, rate, text];
  db.query(
    'INSERT INTO `Review`(`Tutor_userName`, `Tutee_userName`, `rate`, `text`) VALUES (?,?,?,?)',
    param,
    (err, row) => {
      if (err) {
        console.log(err);
        res.send({ msg: 'fail' })
      } else {
        res.send({ msg: 'success' });
      }
    });
});

// 리뷰 수정
router.patch('/editReview', async (req, res) => {
  const { reviewId, rate, text } = req.body;
  console.log(req.body)
  const sql1 = 'UPDATE Review SET rate=?, text=? WHERE reviewId=?'
  db.query(sql1, [rate, text, reviewId], (err, datas) => {
    if (err) {
      console.log(err)
    } else {
      const sql2 = 'SELECT * FROM Review WHERE reviewId=?'
      db.query(sql2, reviewId, (err, data) => {
        res.send({ data })
      })
    }
  });
});

// 리뷰 삭제
router.delete('/deleteReview', async (req, res) => {
  const { reviewId } = req.body;
  const sql1 = 'DELETE FROM Review WHERE reviewId=?'
  db.query(sql1, [reviewId], (err, data) => {
    if (data.affectedRows == 0) {
      console.log(err);
      res.send({ msg: 'fail, 일치하는 reviewId가 없거나 이미 삭제된 내용입니다.' })
      return
    } else {
      const sql2 = 'SELECT * FROM Review WHERE reviewId=?'
      db.query(sql2, reviewId, (err, data) => {
        res.send({ msg: 'success' })
      })
    }
  });
});

module.exports = router;