const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');

router.get('/:projectId', async (req, res) => {
  let projectId = req.params.projectId;
  try {

    const corporationList = await pool.query(
      `SELECT *
       FROM corporations
       WHERE project_id = $1`, [
        projectId
      ]
    );

    res.json(corporationList.rows);

  } catch (error) {
    console.log(`get corporation list from ${projectId} error: ${error}`);
    res.status(500).json('伺服器錯誤');
  }
});

module.exports = router;