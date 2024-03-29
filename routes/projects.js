const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');
const multer = require('multer');

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log('multer bodys----------------');
    console.log(req.body);
    // let corporationName = JSON.parse(req.body.metadata).corporation;
    // let projectName = JSON.parse(req.body.metadata).name;
    // callback(null, `./images/${corporationName}/${projectName}/`);   // 除非預先創立公司名稱資料夾
    callback(null, `./images/`);
  },
  filename: function (req, file, callback) {
    let corporationName = JSON.parse(req.body.metadata).corporation;
    let projectName = JSON.parse(req.body.metadata).name;
    callback(null,  corporationName + '_' + projectName + '_' + 'thumbnail' + '.jpg');
  }
});

const upload = multer({storage: storage});

router.post('/add', upload.single('project_thumbnail'), async(req, res) => {
  try {
    var meta_json = JSON.parse(req.body.metadata);
    console.log(meta_json);
    const { name, address, corporation } = meta_json;
    const { path } = req.file;

    // 需加上檢查是否有同名專案存在
    const newProject = await pool.query(
      `INSERT INTO projects (
        project_image_path,
        project_name,
        project_address,
        project_corporation
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING *`,
      [ path, name, address, corporation ]
    );

    // console.log(newProject.rows[0]);
    res.json({
      path: newProject.rows[0].project_image_path,
      message: '新增專案成功'
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json('伺服器錯誤');
  }
});

router.get('/list/all', async(req, res) => {
  console.log(req.headers);
  try {
    console.log(req.body);
    const allProjects = await pool.query(
      `SELECT *
       FROM projects
       ORDER BY project_corporation`
      );
    console.log(allProjects.rows);
    res.json(allProjects.rows);  // 暫時將所有欄位回傳
  } catch (error) {
    console.log(`Get all projects error: ${error}`);
    res.status(500).json("Server Error.");
  }  
});

router.get('/list/:corporation', async (req, res) => {
  try {
    let corporation = req.params.corporation;
    console.log(corporation);

    const projectsList = await pool.query(
      `SELECT *
       FROM projects
       WHERE project_corporation = $1`, [
        corporation
      ]
    );

    console.log(projectsList.rows);
    res.json(projectsList.rows);

  } catch (error) {
    console.log(`get project list from ${corporation} error: ${error}`);
    res.status(500).json('伺服器錯誤');    
  }
})

// 回傳thumbnails
router.get('/get/thumbnail/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const project = await pool.query(
      `SELECT project_image_path
       FROM projects
       WHERE project_id = $1`,[
        id
      ]
    );
    console.log(project.rows[0].project_image_path);
    const path = project.rows[0].project_image_path;
    res.sendFile(path, {root: '.'});
  } catch (error) {
    console.log(error.message);
    res.status(500).json('伺服器錯誤');
  }
})

// 更新專案資訊
router.patch('/update/:id', async (req, res) => {
  try {
    
  } catch (error) {
    
  }
});

// 專案管理員:使用者資訊頁面/專案清單(特定公司)
router.get('/:corporation', authorization, async(req, res) => {
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
router.get('/works_on/:userId', async (req, res) => {
  let user_name = req.body.name;
  try {
    // let user_id = req.body.uuid;
    let userId = req.params.userId;
    
    const project_id = await pool.query(
      `SELECT project_id
       FROM works_on
       WHERE user_id = $1`, [
      userId
    ]);

    let selected_project_id = project_id.rows[0].project_id;
    console.log(selected_project_id);

    const selected_project = await pool.query(
      `SELECT *
       FROM projects
       WHERE project_id = $1`, [
        selected_project_id
      ]
    );
    
    console.log(selected_project.rows);
    res.json(selected_project.rows);

  } catch (error) {
    console.log(`Get projects for ${user_name} error: ${error}`);
  }
});

module.exports = router;
