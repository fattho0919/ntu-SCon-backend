const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');

router.get('/list/:issueId', async (req, res) => {
  try {
    const issueId = req.params.issueId;

    const labels = await pool.query(
      `SELECT *
       FROM labels
       WHERE issue_id = $1`, [
        issueId
      ]
    );

    res.json(labels.rows);

    // console.log(issueId);
  } catch (error) {
    console.log(`List labels error: ${error}`);
  }
});

router.post('/add/:issueId', async (req, res) => {
  try {
    console.log(req.body);
    const issueId = req.params.issueId;
    const {
      max_x,
      max_y,
      min_x,
      min_y,
      issue_id,
      name,
      mode,
      path
    } = req.body.newLabel;

    const newLabel = await pool.query(
      `INSERT INTO labels (
        issue_id,
        max_x,
        max_y,
        min_x,
        min_y,
        label_name,
        label_mode,
        label_path
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING *`, [
        issueId, max_x, max_y, min_x, min_y, name, mode, path
      ]
    );

    console.log(newLabel.rows[0]);

  } catch (error) {
    console.log(`add label error: ${error}`);
  }
});

module.exports = router;
