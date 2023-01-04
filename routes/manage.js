const router = require('express').Router();
const { Router } = require('express');
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.put('/permission', /*authorization,*/ async(req, res) => {
  try {
    // 取得用戶uuid, project_id
    const user = req.body;
    console.log(user);
     
    const user_new_permission = await pool.query('UPDATE users SET user_permission = $1 WHERE user_id = $2 RETURNING *', [
      user.user_permission, user.user_id
    ]);

    res.json(user_new_permission);

    // Bind用戶uuid, project_id加入worksOn table

    // res.json送回前端並改變前端專案的state

    // webSocket送通知到改變狀態用戶的app

  } catch (error) {
    console.log(`Modify permission error: ${error}`);
  }
});

module.exports = Router;
