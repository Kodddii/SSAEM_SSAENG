// 네이버 Papago 언어감지 API 예제
const express = require('express');
const router = express.Router();
const request = require('request')
// const api_url = "https://openapi.naver.com/v1/papago/detectLangs";
// const client_id = process.env.NAVER_TRANSLATE_ID;
// const client_secret = process.env.NAVER_TRANSLATE_SECRET;
// const query = "nice to meet you";

router.post('/translate', (req, res, next) => {
  console.log('translate')
})

router.get('/translate', function (req, res) {
  let api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  let options = {
    url: api_url,
    form: {
      source: "en",
      target: "ko",
      // text: query,
      text: req.query.text,
    },
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_TRANSLATE_ID,
      'X-Naver-Client-Secret': process.env.NAVER_TRANSLATE_SECRET,
    },
  };
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(options)
      console.log(body)
      res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

// const options = {
//   url: api_url,
//   form: { source: "en", target: "ko", 'text':query},
//   headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
// },
// router.get('/detectLangs', function (req, res) {
//    var api_url = 'https://openapi.naver.com/v1/papago/detectLangs';
//    var request = require('request');
//    var options = {
//        url: api_url,
//        form: {'text': query},
//        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
//     };
//    request.post(options, function (error, response, body) {
//      if (!error && response.statusCode == 200) {
//        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
//        res.end(body);
//      } else {
//        res.status(response.statusCode).end();
//        console.log('error = ' + response.statusCode);
//      }
//    });
//  });
//  router.listen(3000, function () {
//    console.log('http://127.0.0.1:3000/detectLangs app listening on port 3000!');
//  });

 module.exports = router;