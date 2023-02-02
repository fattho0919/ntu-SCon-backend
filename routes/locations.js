const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');

router.post('/add', async (req, res) => {
  try {
    console.log(req.body);
    const { location, projectId } = req.body;

    const newLocation = await pool.query(
      `INSERT INTO locations (
        location_name,
        project_id
      ) VALUES (
        $1, $2
      ) RETURNING *`,
      [location, projectId]
    );
    console.log(newLocation.rows);


  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
