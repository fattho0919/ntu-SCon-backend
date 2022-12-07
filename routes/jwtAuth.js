const router = require('express').Router();
const pool = require("../db");
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

// register
router.post("/register", validInfo, async(req, res) => {	// validInfo to verify the email and password
	try {
			
		const { name, corporation, email, password, permission } = req.body;

		const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
			email
		]);

		if (user.rows.length !== 0) {
			// return res.status(401).send("User already exist.");
			return res.send('User already exist.');
		}

		// 密碼加密
		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const bcryptPassword = await bcrypt.hash(password, salt);
		
		// 用戶註冊資料存入資料庫
		const newUser = await pool.query(
			"INSERT INTO users (user_name, user_corporation, user_email, user_password, user_permission) VALUES ($1, $2, $3, $4, $5) RETURNING *",
			[name, corporation, email, bcryptPassword, permission]
		);

		// for檢查用戶資料
		console.log(user.rows[0]);
		// 產生jwt
		const token = jwtGenerator(newUser.rows[0].user_id);

		// 把token與部分用戶資料送回APP
		res.json({ token, "user":{"name": `${name}`, "corporation": `${corporation}`, "email": `${email}`, "permission": `${permission}` }});

	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server Error");
	}
});

// login
router.post("/login", validInfo, async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
			email
		]);

		// 根據email檢查用戶是否存在
		if (user.rows.length === 0) {
			return res.status(401).json("User doesn't exist.");
		}

		// 將輸入之密碼和資料庫中的密碼做比對
		const validPassword = await bcrypt.compare(
			password, user.rows[0].user_password
		);

		// 若密碼不符，return密碼錯誤訊息
		if (!validPassword) {
			return res.status(401).json("Password is incorrect.");
		}

		console.log(user.rows[0]);
		const token = await jwtGenerator(user.rows[0].user_id);

		// 把token與部分用戶資料送回APP
		res.json({ token, "user":{"name": `${user.rows[0].user_name}`, "corporation": `${user.rows[0].user_corporation}`, "email": `${user.rows[0].user_email}`, "permission": `${user.rows[0].user_permission}`}});
		
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server Error");
	}
});

router.get("/is-verify", authorization, async (req, res) => {
	try {

		res.json(true);
		
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;