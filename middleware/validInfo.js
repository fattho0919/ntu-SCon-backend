module.exports = (req, res, next) => {
  // console.log(req);
  const { name, corporation, email, password, permission } = req.body;

  function validEmail(userEmail) {  // check if the email is in correct format
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail); // 正規表達式?
  }

  if (req.path === "/register") {
    console.log([name, corporation, email, password, permission]);
    if (![name, corporation, email, password, permission].every(Boolean)) {  // what is every() do?
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  }

  next(); // send to next route
};