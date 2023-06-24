const router = require('express').Router();
const pool = require('../services/pool');
const jwtr = require('../services/jwtr');
const bcrypt = require('bcryptjs');
const jwtGenerator = require('../utils/jwtGenerator');
const validation = require("../src/middleware/validation");				// 確認信箱格式、必填資訊是否存在
const authorization = require("../src/middleware/authorization");	// 確認用戶是否擁有token
const sendMail = require('../utils/sendMailer');

router.get('/mail', async (req, res) => {
	try {
		const a = sendMail();
		res.json('success');
	} catch (error) {
		console.log(error);
	}
})

router.post('/register', validation, async (req, res) => {
	try {
		const { name, corporation, email, password } = req.body;

		const corporationID = await pool.query(
			`SELECT corporation_id FROM corporations WHERE corporation_name = $1`,
			[ corporation ]
		);

		const user = await pool.query(
			`SELECT * FROM users WHERE user_email = $1`,
			[ email ]
		);

		if (user.rows.length !== 0) {
			return res.status(401).json('使用者已存在');
		}

		// Encrypt using "bcryptjs" module
		const saltRounds = 10;
		const salt = await bcrypt.genSaltSync(saltRounds);
		const bcryptPassword = await bcrypt.hashSync(password, salt);

		console.log(corporationID.rows[0]);
		
		const newUser = await pool.query(
			`INSERT INTO users (
				user_name,
				user_email,
				user_password,
				user_job,
				corporation_id
			) VALUES (
				$1, $2, $3, $4, $5
			) RETURNING *`,
			[name, email, bcryptPassword, '未指派', corporationID.rows[0].corporation_id]
		);

		const assign_permission = pool.query(
			`INSERT INTO user_role VALUES ($1, $2)`,
			[ newUser.rows[0].user_id, '訪客']
		);

		const token = await jwtGenerator(newUser.rows[0].user_id);

		res.json({
			token,
			"user": {
				"uuid": `${newUser.rows[0].user_id}`,
				"name": `${newUser.rows[0].user_name}`,
				"email": `${newUser.rows[0].user_email}`,
				"corporation": corporation,
				"permission": "訪客",
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
			`SELECT * FROM users WHERE user_email = $1`,
			[ email ]
		);

		if (user.rows.length === 0) {
			return res.status(401).json('使用者不存在或密碼錯誤');
		}

		const corporationID = user.rows[0].corporation_id;
		const userID = user.rows[0].user_id;

		const corporation = await pool.query(
			`SELECT corporation_name FROM corporations WHERE corporation_id = $1`,
			[ corporationID ]
		);

		const permission = await pool.query(
			`SELECT permission_level FROM user_role WHERE user_id = $1`,
			[ userID ]
		)

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
				"corporation": corporation.rows[0].corporation_name,
				"email": `${user.rows[0].user_email}`,
				"permission": permission.rows[0].permission_level,
				"job": `${user.rows[0].user_job}`
			}
		});

	} catch (err) {
		console.log(err.message);
		res.status(500).json('伺服器錯誤:無法登入');
	}
});

router.post('/logout', async (req, res) => {
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
