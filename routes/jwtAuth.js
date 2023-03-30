const router = require('express').Router();
const pool = require('../services/pool');
const jwtr = require('../services/jwtr');
const bcrypt = require('bcryptjs');
const jwtGenerator = require('../utils/jwtGenerator');
const validation = require("../middleware/validation");				// 確認信箱格式、必填資訊是否存在
const authorization = require("../middleware/authorization");	// 確認用戶是否擁有token

router.post('/register', validation, async (req, res) => {
	try {
		const { name, corporation, email, password } = req.body;

		const user = await pool.query(
			`SELECT *
			 FROM users
			 WHERE user_email = $1`
			 , [
				email
			]);

		if (user.rows.length !== 0) {
			return res.status(401).json('使用者已存在');
		}

		const saltRounds = 10;
		const salt = await bcrypt.genSaltSync(saltRounds);
		const bcryptPassword = await bcrypt.hashSync(password, salt);
		
		const newUser = await pool.query(
			`INSERT INTO users (
				user_name,
				user_corporation,
				user_email,
				user_password,
				user_permission,
				user_job
			) VALUES (
				$1, $2, $3, $4, $5, $6
			) RETURNING *`,
			[name, corporation, email, bcryptPassword, '訪客', '無']
		);

		const token = await jwtGenerator(newUser.rows[0].user_id);

		res.json({
			token,
			"user": {
				"uuid": `${newUser.rows[0].user_id}`,
				"name": `${newUser.rows[0].user_name}`,
				"corporation": `${newUser.rows[0].user_corporation}`,
				"email": `${newUser.rows[0].user_email}`,
				"permission": `${newUser.rows[0].user_permission}`,																		//	註冊後預設為訪客(管理員直接透過資料庫新增)
				"job": `${newUser.rows[0].user_job}`
			}
		});

	} catch (err) {
		console.log(err.message);
		res.status(500).json('伺服器錯誤:無法註冊');
	}
});

router.post('/login', validation, async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await pool.query(
			`SELECT *
			 FROM users
			 WHERE user_email = $1`, [
				email
			]);

		if (user.rows.length === 0) {
			return res.status(401).json('使用者不存在或密碼錯誤');
		}

		const validPassword = await bcrypt.compareSync(
			password, user.rows[0].user_password
		);

		if (!validPassword) {
			return res.status(401).json('使用者不存在或密碼錯誤');
		}

		const token = await jwtGenerator(user.rows[0].user_id);

		res.json({
			token,
			"user": {
				"uuid": `${user.rows[0].user_id}`,
				"name": `${user.rows[0].user_name}`,
				"corporation": `${user.rows[0].user_corporation}`,
				"email": `${user.rows[0].user_email}`,
				"permission": `${user.rows[0].user_permission}`,
				"job": `${user.rows[0].user_job}`
			}
		});

	} catch (err) {
		console.log(err.message);
		res.status(500).json('伺服器錯誤:無法登入');
	}
});

router.post('/logout', async (req, res) => {
	// 開發階段測試
	console.log(req.body);
	try {
		const user_id = req.body.uuid;

		const payload = {
			jti: user_id,
		};

		await jwtr.destroy(payload.jti, process.env.jwtSecret);

		res.status(200).json('您已登出');

	} catch (err) {
		console.log(err.message);
		res.status(500).json('伺服器錯誤:無法登出');
	}
})

router.get('/authorization', authorization, async (req, res) => {
	try {
		res.json(true);
	} catch (err) {
		console.log(err.message);
		res.status(500).json('伺服器錯誤:無法進行身份驗證');
	}
});

module.exports = router;
