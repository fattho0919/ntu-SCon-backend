const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../src/middleware/authorization');

router.post('/:userId/:projectId', async (req, res) => {
  try {
    console.log(req.params);
    let userId = req.params.userId;
    let projectId = req.params.projectId;

    const check = await pool.query(
      `SELECT * FROM participate WHERE user_id = $1`,
      [userId]
    );

    if (check !== 0) {
      return res.status(400).json('此使用者已隸屬於此專案');
    }

    const tmp = await pool.query(
      `
      INSERT INTO participate (
        user_id,
        project_id
      ) VALUES (
        $1, $2
      ) RETURNING *
      `,
      [ userId, projectId ]
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

    res.json(works_on.rows);
    
  } catch (error) {
    console.log(`Bind project and manager error: ${error}`);
  }
});

module.exports = router;
