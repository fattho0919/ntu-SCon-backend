const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');

router.get('/:projectId', async (req, res) => {
  try {
    const project_id = req.params.projectId;

    const tasks = await pool.query(
      `SELECT *
       FROM tasks
       WHERE project_id = $1`, [
        project_id
      ]
    );



  } catch (error) {
    res.status(500).json(`伺服器錯誤: ${error.message}, 請稍候再試`);
  }
});

router.post('/:projectId', async (req, res) => {
  try {
    const { task } = req.body;
    const project_id = req.params.projectId;

    const newTask = await pool.query(
      `INSERT INTO tasks (
        project_id,
        task_name
      ) VALUES (
        $1, $2
      ) RETURNING task_name`, [
        project_id, task
      ]
    );

    console.log(newTask);

  } catch (error) {
    res.status(500).json(`伺服器錯誤: ${error.message}, 請稍候再試`);
  }
});

module.exports = router;
