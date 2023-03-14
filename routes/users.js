const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');

router.get('/all', async(req, res) => {
  try {
    const allUsers = await pool.query(
      `SELECT user_id, user_name, user_corporation, user_permission, user_job
       FROM users
       ORDER BY user_corporation, user_permission`
    );

    // console.log(allUsers.rows);
    res.json(allUsers.rows);

  } catch (error) {
    console.log(`Get all users error: ${error}`);
    res.status(500).json('伺服器錯誤');
  }
});

router.get('/project/manager/:corporation', async (req,res) => {
  try {
    let corporation = req.params.corporation;
    console.log(corporation);

    const managers = await pool.query(
      `SELECT *
       FROM users
       WHERE user_corporation = $1 AND user_permission = '專案管理員'`, [
        corporation
      ]
    );

    console.log(managers.rows);
    res.json(managers.rows);

  } catch (error) {
    console.log(error);
    res.status(500).json(`${error}`);
  }
});

router.get('/:corporation', async(req, res) => {
  try {
    // 在前端帶入使用者身分與公司，包進request
    let corporation = req.params.corporation;
    console.log(corporation);

    const subUsers = await pool.query(
      `SELECT user_id, user_name, user_corporation, user_permission, user_job
       FROM users
       WHERE user_corporation = $1`, [
      corporation
      ]
    );
    
    console.log(subUsers)
    res.json(subUsers.rows);

  } catch (error) {
    console.log(`get corporation users error: ${error}`);
    res.status(500).send('伺服器錯誤');
  }
});

module.exports = router;
