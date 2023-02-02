const router = require('express').Router();
const { Router } = require('express');
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');

router.post('/manage', /*authorization,*/ async(req, res) => {
  try {
    // 取得用戶uuid, project_id
    const user = req.body;
    console.log(user);
     
    const user_new_permission = await pool.query(
      `UPDATE users
       SET user_permission = $1
       WHERE user_id = $2 RETURNING *`, [
        user.permission, user.userId
      ]
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
