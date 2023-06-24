const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../src/middleware/authorization');

router.post('/add', async (req, res) => {
  try {
    console.log(req.body);
    const { locationName, floor, position, projectId } = req.body;

    const newLocation = await pool.query(
      `INSERT INTO locations (
        location_name,
        floor,
        position,
        project_id
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING floor, position`,
      [locationName, floor, position, projectId]
    );
    console.log(newLocation.rows);

  } catch (error) {
    res.status(500).json(`伺服器錯誤: ${error.message}, 請稍候再試`);
  }
});

router.get('/list/:projectId', async (req, res) => {
  try {
    console.log(req.params);
    const projectId = req.params.projectId;
    console.log(projectId);

    const issueLocations = await pool.query(
      `SELECT floor, position
       FROM locations
       WHERE project_id = $1`, [
        projectId
      ]
    );

    // console.log(issueLocations.rows);
    res.json(issueLocations.rows);

  } catch (error) {
    res.status(500).json(`伺服器錯誤: ${error.message}, 請稍候再試`);
  }
});

module.exports = router;
