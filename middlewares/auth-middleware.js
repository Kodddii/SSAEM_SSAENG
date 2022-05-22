const jwt = require("jsonwebtoken");
const db = require('../config');

module.exports = (req, res, next) => {
  console.log(req.headers)
  console.log(req.cookies)
  console.log(req.headers.cookies)
  const authToken = req.cookies.token
  // console.log(req.headers)
  // console.log(authToken)
  
 
    const { userName } = jwt.verify(authToken, process.env.JWT_SECRET);
    console.log({ userName });

    const sql1 = 'select * from Tutee where userName=?'
      db.query(sql1, userName, (err, datas1) => {
        if (err) console.log(err);
    if(datas1.length){
      res.locals.user = datas1[0];
      next();
    };
  });
    const sql2 = 'select * from Tutor where userName=?'
      db.query(sql2, userName, (err, datas2) => {
        if (err) console.log(err);
    if(datas2.length){
      res.locals.user = datas2[0];
      next();
    };
  });
};