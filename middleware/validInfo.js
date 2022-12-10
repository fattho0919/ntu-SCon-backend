module.exports = (req, res, next) => {

  const { name, corporation, email, password } = req.body;

  function validEmail(userEmail) {  // check if the email is in correct format
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail); // 正規表達式?
  }

  if (req.path === "/register") {
    console.log([name, corporation, email, password]);
    if (![name, corporation, email, password].every(Boolean)) {
      
      return res.status(401).json("缺少憑證");

    } else if (!validEmail(email)) {
      
      return res.status(401).json("信箱格式不合法");

    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      
      return res.status(401).json("缺少憑證");

    } else if (!validEmail(email)) {
      
      return res.status(401).json("信箱格式不合法");

    }
  }

  // 呼叫中介軟體的下個函式
  next(); 
};