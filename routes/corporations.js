const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');

router.post('/add', async (req, res) => {
  try {
    const { company, manager, phone_number, projectId } = req.body;

    const newCorp = await pool.query(
      `INSERT INTO corporations (
        corporation_name,
        corporation_manager,
        corporation_phone,
        project_id
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING *`, [
        company, manager, phone_number, projectId
      ]
    );

    res.json(newCorp.rows[0]);

  } catch (error) {
    console.log(error);
    res.status(500).json(`Add corporation error: ${error}`);
  }
});

router.get('/list/:projectId', async (req, res) => {
  let projectId = req.params.projectId;
  try {

    const corporationList = await pool.query(
      `SELECT corporation_name
       FROM corporations
       WHERE project_id = $1`, [
        projectId
      ]
    );

    res.json(corporationList.rows);

  } catch (error) {
    console.log(`Get corporation list from ${projectId} error: ${error}`);
    res.status(500).json('伺服器錯誤');
  }
});

module.exports = router;
