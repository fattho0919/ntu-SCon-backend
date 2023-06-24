const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../src/middleware/authorization');

router.get('/:userId', async (req, res) => {
  try {
    console.log(req.params);
    receiverId = req.params.userId;

    const notifications = await pool.query(
      `SELECT notify_msg FROM notifications WHERE receiver_id = $1`,
      [ receiverId ]
    );

    console.log(notifications.rows);
    res.json(notifications.rows);

  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
