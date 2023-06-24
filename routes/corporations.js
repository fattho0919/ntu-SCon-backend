const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../src/middleware/authorization');

router.get('/all', async (req, res) => {
  try {
    const corporations = await pool.query(
      `SELECT * FROM corporations`
    );
    console.log(corporations.rows);
    res.json(corporations.rows);
  } catch (error) {
    res.status(500).json('伺服器錯誤');
  }
});

router.get('/:projectID', async (req, res) => {
  try {
    const corporations = await pool.query(
      `SELECT * FROM corporations`
    );
    console.log(corporations.rows);
    res.json(corporations.rows);
  } catch (error) {
    res.status(500).json('伺服器錯誤');
  }
});

router.post('/:type', async (req, res) => {
  try {
    const type = req.params.type;
    const { company, projectId } = req.body;
    console.log(company);
    console.log(projectId);

    const new_corporation = await pool.query(
      `
      INSERT INTO corporations (corporation_name, corporation_type)
      VALUES ($1, $2)
      `,
      [ company, type ]
    );

    res.json('新增責任廠商成功');

  } catch (error) {
    res.status(500).json('伺服器錯誤');
  }
});

module.exports = router;
