const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');

router.post('/:userId/:projectId', async (req, res) => {
  try {
    console.log(req.params);
    let userId = req.params.userId;
    let projectId = req.params.projectId;

    // 需事先檢查table內有沒有既有的bind關聯

    const works_on = await pool.query(
      `INSERT INTO works_on (
        user_id,
        project_id
      ) VALUES (
        $1, $2
      ) RETURNING *`, [
        userId, projectId
      ]
    );

    let user_id = works_on.rows[0].user_id;
    let project_id = works_on.rows[0].project_id;

    const select_project_manager_name = await pool.query(
      `SELECT user_name
       FROM users
       WHERE user_id = $1`, [
        user_id
      ]
    );
    let user_name = select_project_manager_name.rows[0].user_name;

    const bind = await pool.query(
      `UPDATE projects
       SET project_manager = $1
       WHERE project_id = $2`, [
        user_name, project_id
      ]
    );

    console.log(bind.rows[0]);

    res.json(works_on.rows);
    
  } catch (error) {
    console.log(`Bind project and manager error: ${error}`);
  }
});

module.exports = router;
