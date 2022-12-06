const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const { name, address, corporation, manager, inspector, email } = req.body;
    // 不確定專案名稱是否具有唯一性
    // const project = await pool.query(
    //   "SELECT * FROM projects WHERE project_name = $1", [
    //     name
    //   ]
    // );

    const newProject = await pool.query(
      "INSERT INTO projects (project_name, project_address, project_corporation, project_manager, project_inspector, project_email) VALUES ($1, $2, $3, $4, $5, $6)",
      [ name, address, corporation, manager, inspector, email ]
    );

    // 這邊應該要設計資料庫查詢的語法(比較複雜的、關聯table的)
    // const projects = await pool.query(
    //   "SELECT * FROM projects"
    // );

    res.json(newProject);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Server Error.");
  }
});

module.exports = router;
