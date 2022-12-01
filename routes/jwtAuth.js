const router = require('express').Router();
const pool = require("../db");
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

// register
router.post("/register", validInfo, async(req, res) => {	// validInfo to verify the email and password
	try {
			
		const { name, corporation, email, password } = req.body;

		const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
			email
		]);

		if (user.rows.length !== 0) {
			// return res.status(401).send("User already exist.");
			return res.send('User already exist.');
		}

		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const bcryptPassword = await bcrypt.hash(password, salt);
		
		const newUser = await pool.query(
			"INSERT INTO users (user_name, user_corporation, user_email, user_password) VALUES ($1, $2, $3, $4) RETURNING *",
			[name, corporation, email, bcryptPassword]
		);

		console.log(user.rows[0]);
		const token = jwtGenerator(newUser.rows[0].user_id);

		// Send required information back to frontend
		res.json({ token, "user":{"email": `${email}`, "name": `${name}`}, "corporation": `${corporation}` });

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

		if (user.rows.length === 0) {
			return res.status(401).json("User doesn't exist.");
		}

		const validPassword = await bcrypt.compare(
			password, user.rows[0].user_password
		);

		if (!validPassword) {
			return res.status(401).json("Email or Password is incorrect.");
		}

		console.log(user.rows[0]);
		const token = jwtGenerator(user.rows[0].user_id);
		// res.json({ token });
		res.json({ token, "user":{"email": `${email}`, "name": `${user.rows[0].user_name}`} });
		
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
		res.status(500).send("Server Error - 3");
	}
});

module.exports = router;