const jwt = require("jsonwebtoken");
const db = require('../config');

module.exports = (req, res, next) => {
    const authToken = req.headers.token  //프론트에서 요쳥할때 사용
    //  const authToken = req.cookies.token; //서버에서 테스트할때 사용
  
    // console.log(req.headers);
    // console.log(authToken);
    try {
      const { userEmail } = jwt.verify(authToken, process.env.JWT_SECRET);
      console.log({ userEmail });

      const sql1 = 'select * from Tutee where userEmail=?'
      db.query(sql1, userEmail, (err, datas1) => {
        if (err) console.log(err);
        if(datas1.length){
        res.locals.user = datas1[0];
        next();
        };
      });
      const sql2 = 'select * from Tutor where userEmail=?'
      db.query(sql2, userEmail, (err, datas2) => {
        if (err) console.log(err);
        if(datas2.length){
        res.locals.user = datas2[0];
        next();
        };
      });
      
    } catch (error) {
      
    }
    
};