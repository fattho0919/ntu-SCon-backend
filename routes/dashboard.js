const router = require('express').Router();
const pool = require("../db");
const authorization = require('../middleware/authorization');

router.get("/", authorization, async (req, res) => {
  try {
    // res.json(req.user); // pass from authorization route
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      req.user
    ]);

    res.json(user.rows); // send back the user name instead of whole user information including password
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server Error.");
  }
});

module.exports = router;