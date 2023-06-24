module.exports = (req, res, next) => {

  const { name, corporation, email, password } = req.body;

  function validEmail(userEmail) {  // check if the email is in correct format
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail); // 正規表達式
  }

  if (req.path === "/register") {
    if (![name, corporation, email, password].every(Boolean)) {
      
      return res.status(401).send('註冊:缺少必要資訊');

    } else if (!validEmail(email)) {
      
      return res.status(401).send('註冊:信箱格式不合法');

    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      
      return res.status(401).send('登入:缺少必要資訊');

    } else if (!validEmail(email)) {
      
      return res.status(401).send('登入:信箱格式錯誤');

    }
  }
  // 呼叫中介軟體的下個函式
  next(); 
};
