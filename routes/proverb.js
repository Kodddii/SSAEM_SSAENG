const express = require('express');
const router = express.Router();
const db = require('../config');
const axios = require('axios');
const cheerio = require('cheerio');
const { title } = require('process');

router.get('/proverb', async (req, res) => {
  const getHtml = async () => {
    try {
      return await axios.get("https://kanu.tistory.com/887#");
    } catch (error) {
      console.error(error);
    }
  };

  getHtml()
    .then(html => {
      let titleList = [];
      let meanList_nofilter = [];
      let meanList = [];
      let proverbList = [];
      const $ = cheerio.load(html.data);
      const $titleList = $("div.e-content div.tt_article_useless_p_margin").children("h3");
      const $meanList = $("div.e-content div.tt_article_useless_p_margin").children("p");
      $titleList.each(function (i, elem) {
        titleList[i] = $(this).text()
      })
      $meanList.each(function (i, elem) {
        meanList_nofilter[i] = $(this).text()
      })
      meanList_nofilter.splice(0, 6)
      meanList_nofilter.pop()
      meanList = meanList_nofilter.filter(Boolean)
      console.log(titleList.length, meanList.length)
      for (i=0;i<titleList.length;i++) {
        proverbList[i] = {
          title: titleList[i],
          mean: meanList[i]
        }
      }
      const k = Math.floor(Math.random()*((100-0)+1))
      console.log(proverbList[k], k)

      // return meanList;
      return {statusCode: 200, body: proverbList[k]}
    })
    // .then(res => console.log(res));
  .then((result) => {
  res.status(result.statusCode).json(result.body)
  })  
})

module.exports = router;