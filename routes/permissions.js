const router = require('express').Router();
const { Router } = require('express');
const pool = require('../services/pool');
const authorization = require('../src/middleware/authorization');

router.post('/manage', /*authorization,*/ async(req, res) => {
  try {
    const user = req.body;
    console.log(user);
     
    const user_new_permission = await pool.query(
      `UPDATE user_role SET permission_level = $1 WHERE user_id = $2 RETURNING *`,
      [ user.permission, user.userId ]
    );

    res.json(user_new_permission);

    // Bind用戶uuid, project_id加入works_on table

    // res.json送回前端並改變前端專案的state

    // webSocket送通知到改變狀態用戶的app

  } catch (error) {
    console.log(`Manage permission error: ${error}`);
  }
});

module.exports = router;
