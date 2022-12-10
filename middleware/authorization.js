const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {  // next can keep going to the route
  try {
    // Destruct the token:前端送出請求中包含的token
    const jwtToken = req.header("token"); 

    // 確認token是否存在(用戶端是否送出)
    if (!jwtToken) {
      return res.status(403).json("您尚未取得授權");
    }

    // 跟server端的secret key驗證(payload當初在sign時僅帶uuid)
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);  // check if it's valid, if yes, return payload then we can use in the route

    console.log(payload);

    req.user = payload.user;

    // 呼叫此middleware的下一函式
    next();

  } catch (error) {
    console.error(error.message);
    return res.status(403).json("您尚未取得授權");
  }
}