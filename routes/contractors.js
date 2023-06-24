const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../src/middleware/authorization');

router.post('/', async (req, res) => {
  try {
    const { company, name, projectId } = req.body;

    const newCorp = await pool.query(
      `INSERT INTO manufacturers (
        manufacturer_name,
        project_id
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING *`, [
        company, projectId
      ]
    );

    const newTask = await pool.query(
      `INSERT INTO tasks () VALUES ($1) RETURNING *`,
      [name]
    );

    res.json(newCorp.rows[0]);

  } catch (error) {
    console.log(error);
    res.status(500).json(`Add contractor error: ${error}`);
  }
});

router.get('/:projectId', async (req, res) => {
  let projectId = req.params.projectId;
  try {

    const corporationList = await pool.query(
      `SELECT *
       FROM manufacturers
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
