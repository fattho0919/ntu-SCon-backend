const router = require('express').Router;
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.put('/', authorization, async(req, res) => {
  try {
    // 取得用戶uuid, project_id
    
    // Bind用戶uuid, project_id加入worksOn table

    // res.json送回前端並改變前端專案的state

    // webSocket送通知到改變狀態用戶的app

  } catch (error) {
    
  }
});