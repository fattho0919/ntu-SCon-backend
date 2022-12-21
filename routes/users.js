const router = require('express').Router();
const { Router } = require('express');
const pool = require('../db');
const authorization = require('../middleware/authorization');

// 管理員:使用者資訊頁面/專案清單/使用者清單顯示
router.get('/users/all', authorization, async(req, res) => {
  try {

    const allUsers = await pool.query('SELECT * FROM users');

    res.json(allUsers);  // 在前或後端做sort?

  } catch (error) {

    console.log(`get all users error: ${error}`);

  }
});

// 專案管理員:使用者資訊頁面/專案清單/(該公司)使用者清單顯示
router.get('/users/:corporation', authorization, async(req, res) => {
  // 在前端帶入使用者身分與公司，包進request
  let corporation = req.corporation;
  
  try {
    
    const subUsers = await pool.query('SELECT * FROM users WHERE user_corporation = $1', [
      corporation
    ]);

    res.json(subUsers);

  } catch (error) {
    
    console.log(`get corporation users error: ${error}`);
    
  }
});

module.exports = Router;
