const express = require('express');
const router = express.Router();
// const query = "nice to meet you";


// router.post('/translate', (req, res) => {
//   console.log('translate')
//   res.redirect('/')
// })

router.get('/translate', function (req, res) {
  const request = require('request')
  const api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  // console.log(req)
  const options = {
    url: api_url,
    form: {
      // source: "en",
      // target: "ko",
      // text: query,
      source: req.query.source,
      target: req.query.target,
      text: req.query.text,
    },
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_TRANSLATE_ID,
      'X-Naver-Client-Secret': process.env.NAVER_TRANSLATE_SECRET,
    },
  };
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log('1', options)
      // console.log('2', body)
      // console.log('3', response)
      // console.log('4', req)
      console.log(body.split(":")[5].slice(1,-14))
      res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
      res.end(body.split(":")[5].slice(1,-14))
      // res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

 module.exports = router;