const express = require('express');
const router = express.Router();
const db = require('../config');
const middleware = require('../middlewares/auth-middleware')
// const authMiddleare = require('../middlewares/auth');
///

// 리뷰 전체 불러오기(메인화면)
router.get('/getReview', async (req, res) => {
  const sql = "SELECT * FROM Review ORDER BY tutor_userName"
  db.query(sql, (err, data) => {
    if (err) {
      console.log(err);
      res.send({ msg: 'fail' });
    } else {
      // console.log(data);
      res.send({ data });
    }
  })
})
// 리뷰 불러오기(조회)
router.get('/getReview/:tutor_userName', async (req, res) => {
  const { tutor_userName } = req.params;
  console.log(req.params);
  const sql = "SELECT * FROM Review WHERE tutor_userName=? ORDER BY createdAt DESC"
  db.query(sql, [tutor_userName], (err, data) => {
    if (err) {
      console.log(err);
      res.send({ msg: 'fail' })
    } else {
      res.send({ data });
      console.log(data)
    }
  });
});

// 리뷰 작성
router.post('/addReview', middleware, async (req, res) => {
  const tutee_userName = res.locals.user.userName;
  const { userName, rate, text } = req.body;
  // console.log(tutee_userName, req.body);
  const param = [userName, tutee_userName, rate, text];
  // console.log(param)
  db.query(
    'INSERT INTO `Review`(`tutor_userName`, `tutee_userName`, `rate`, `text`) VALUES (?,?,?,?)',
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
  // const tutee_userName = res.locals.user.userName;
  const { reviewId, rate, text } = req.body;
  console.log(req.body)
  const sql = 'UPDATE Review SET rate=?, text=? WHERE reviewId=?'
  db.query(sql, [rate, text, reviewId], (err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.send({ msg: 'success', data })
    }
    // const sql = 'SELECT * FROM Review WHERE tutee_userName=?'
    // db.query(sql, [tutee_userName], (err, rows) => {
    //   if (rows.length !== 0) {
    //     // const sql = 'SELECT * FROM review WHERE reviewId=?'
    //     const sql = 'UPDATE Review SET rate=?, text=? WHERE reviewId=?'
    //     db.query(sql, [rate, text, reviewId], (err, datas) => {
    //       if (err) {
    //         console.log(err)
    //       } else {
    //         res.send({ msg: 'success' })
    //       }
    //     })
    //   }
  });
});

// 리뷰 삭제
router.delete('/deleteReview', async (req, res) => {
  // const tutee_userName = res.locals.user.userName;
  const { reviewId } = req.body;
  const sql = 'DELETE FROM Review WHERE reviewId=?'

  db.query(sql, [reviewId], (err, data) => {
    if (data == undefined) {
      console.log(err);
      console.log(data);
      res.send({ msg: 'fail' })
    } else {
      console.log(data)
      res.send({ msg: 'success' })
    }
    // const sql = 'SELECT * FROM Review WHERE tutee_userName=?'
    // db.query(sql, [tutee_userName], (err, rows) => {
    //   if (rows.length !== 0) {
    //     console.log(rows)
    //     const sql = 'DELETE FROM Review WHERE reviewId=?'

    //     db.query(sql, [reviewId], (err, data) => {
    //       if (data == undefined) {
    //         console.log(err);
    //         console.log(data);
    //         res.send({ msg: 'fail' })
    //       } else {
    //         console.log(data)
    //         res.send({ msg: 'success' })
    //       }
    //     })
    //   } else {
    //     res.send({ msg: 'fail' })
    //   }
  });
});

module.exports = router;