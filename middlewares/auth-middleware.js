const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  
  const [authType, authToken] = authorization.split(" ");
  
  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    const { userName } = jwt.verify(authToken, process.env.JWT_SECRET);
    console.log({ userName });

    const sql1 = 'select * from Tutee where userName=?'
    const sql2 = 'select * from Tutor where userName=?'
    User.findByPk({ userId }).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    return res.status(401).send({ errorMessage: "로그인 후 사용하세요." });
  }
};
