const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const {authorization} = req.headers;
  const [authType, authToken] = (authorization || '').split(' ');
  if (!authToken || authType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다.',
    });
    return;
  }

  try {
    const {userId} = jwt.verify(authToken, 'my-secret-key');
    console.log(userId);
    User.findByPk(userId).then(user => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    return res.status(401).send({errorMessage: '로그인 후 사용하세요.'});
  }
};
