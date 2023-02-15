const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');

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
      ) RETURNING *`,
      [locationName, floor, position, projectId]
    );
    console.log(newLocation.rows);

  } catch (error) {
    console.log(error);
  }
});

router.get('/list/:projectId', async (req, res) => {
  try {
    console.log(req.params);
    const projectId = req.params.projectId;
    console.log(projectId);

    const issueLocations = await pool.query(
      `SELECT *
       FROM locations
       WHERE project_id = $1`, [
        projectId
      ]
    );

    // console.log(issueLocations.rows);
    res.json(issueLocations.rows);

  } catch (error) {
    console.log(`get locations error: ${error}`);
  }
});

module.exports = router;
