const router = require('express').Router();
const { Router } = require('express');
const pool = require('../db');
const authorization = require('../middleware/authorization');

// 專案管理員:新增專案用
router.post('/add', /*authorization,*/ async(req, res) => {
  try {
    console.log(req.body);
    const { name, address, corporation, manager, inspector, email } = req.body;

    // 從資料庫中找同名專案(專案名稱是否應具唯一性?)
    /* 
    const project = await pool.query(
      "SELECT * FROM projects WHERE project_name = $1", [
        name
      ]
    );
    */

    const newProject = await pool.query(
      "INSERT INTO projects (project_name, project_address, project_corporation, project_manager, project_inspector, project_email) VALUES ($1, $2, $3, $4, $5, $6)",
      [ name, address, corporation, manager, inspector, email ]
    );

    // 這邊應該要設計資料庫查詢的語法(比較複雜的、關聯table的)
    /* const projects = await pool.query("SELECT * FROM projects"); */

    res.json(newProject);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Server Error.");
  }
});

// 管理員:使用者資訊頁面/專案清單
router.get('/all'/*, authorization*/, async(req, res) => {
  try {
    console.log(req.body);
    const allProjects = await pool.query('SELECT * FROM projects ORDER BY project_corporation');

    res.json(allProjects);  // 暫時將所有欄位回傳

  } catch (error) {

    console.log(`get all projects error: ${error}`);

    res.status(500).json("Server Error.");

  }  
});

// 專案管理員:使用者資訊頁面/專案清單(特定公司)
router.get('/:corporation'/*, authorization*/, async(req, res) => {

  //與前端確認request body內容
  let corporation = req.params.corporation;
  console.log(corporation);

  try {        

    const subProjects = await pool.query('SELECT * FROM projects WHERE project_corporation = $1', [
      corporation
    ]);

    res.json(subProjects);

  } catch (error) {

    console.log(`get projects from ${corporation} error: ${error}`);

    res.status(500).json("Server Error.");

  }
});

// 專案使用者:使用者資訊頁面/專案清單(所屬專案)
router.get('/work', authorization, async (req, res) => {
  // 前端要帶入uuid，登入時也該回傳uuid到App端但不須顯示
  let user_id = req.body.uuid;
  let user_name = req.body.name;

  try {
    
    const project_id = await pool.query('SELECT project_id FROM worksOn WHERE user_id = $1', [
      user_id
    ]);

    const projects = await pool.query('SELECT * FROM projects WHERE projects_id IN ')

  } catch (error) {
    
    console.log(`get projects for ${user_name} error: ${error}`);

  }
});

module.exports = router;
