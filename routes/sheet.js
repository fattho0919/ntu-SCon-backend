const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');

router.get('/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    const data = await pool.query(
      `SELECT * FROM issues WHERE project_id = $1`,
      [projectId]
    );

    

  } catch (error) {
    res.status(500).json('伺服器錯誤');
  }
});

module.exports = router;