const express = require('express');
const router = express.Router();
const db = require('../config');
// const authMiddleare = require('../middlewares/auth');
///
// 리뷰 불러오기(조회)
router.get('/getReview/:tutor_name', async (req, res) => {
  const { tutor_name } = req.params;
  console.log(req.params);
  const sql = "SELECT * FROM review WHERE tutor_name=?"
  db.query(sql, [tutor_name], (err, datas) => {
    if (err) {
      console.log(err);
      res.send({ meg: 'fail' })
    } else {
      res.send({ meg: 'success', datas });
      console.log(datas)
    }
  });
});

// 리뷰 작성
router.post('/addReview', async (req, res) => {
  // const { tutee_name, rate, text } = req.body;
  // const { token } = res.locals;
  const { tutor_name, tutee_name, tutee_profile, rate, text } = req.body;
  const reviewId = Math.floor(Math.random() * (2147483647)) + 1;
  console.log(reviewId, req.body);
  const param = [reviewId, tutor_name, tutee_name, tutee_profile, rate, text];
  console.log(param)
  db.query(
    'INSERT INTO `review`(`reviewId`, `tutor_name`, `tutee_name`, `tutee_profile`, `rate`, `text`) VALUES (?,?,?,?,?,?)',
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
  // const { token } = res.locals;
  const { tutee_name, reviewId, rate, text } = req.body;
  const sql = 'SELECT * FROM review WHERE tutee_name=?'
  db.query(sql, [tutee_name], (err, rows) => {
    if (rows.length !== 0) {
      // const sql = 'SELECT * FROM review WHERE reviewId=?'
      const sql = 'UPDATE review SET rate=?, text=? WHERE reviewId=?'
      db.query(sql, [rate, text, reviewId], (err, datas) => {
        if (err) {
          console.log(err)
        } else {
          res.send({ msg: 'success' })
        }
      })
    }
  });
});

// 리뷰 삭제
router.delete('/deleteReview', async (req, res) => {
  // const { token } = res.locals;
  const { tutee_name, reviewId } = req.body;
  const sql = 'SELECT * FROM review WHERE tutee_name=?'
  db.query(sql, [tutee_name], (err, rows) => {
    if (rows.length !== 0) {
      console.log(rows)
      const sql = 'DELETE FROM review WHERE reviewId=?'

      db.query(sql, [reviewId], (err, data) => {
        if (data == undefined) {
          console.log(err);
          console.log(data);
          res.send({ msg: 'fail' })
        } else {
          console.log(data)
          res.send({ msg: 'success' })
        }
      })
    } else {
      res.send({ msg: 'fail' })
    }
  });
});

module.exports = router;