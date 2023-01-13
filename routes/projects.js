const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');
const createProject = require('../middleware/createProject');
const multer = require('multer');

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(req.body);
    callback(null, './images');
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
    console.log(req.file);
    var meta_json = JSON.parse(req.body.metadata);
    const { name, address, corporation, manager, inspector, email } = meta_json;
    const { path } = req.file;

    const newProject = await pool.query(
      `INSERT INTO projects (
        project_image_path,
        project_name,
        project_address,
        project_corporation,
        project_manager,
        project_inspector,
        project_email
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING *`,
      [ path, name, address, corporation, manager, inspector, email ]
    );
    console.log(newProject.rows[0]);
    res.json(newProject.rows[0].project_image_path);
  } catch (error) {
    console.log(error.message);
    res.status(500).json('伺服器錯誤');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params;
    console.log(id.id);
    let num = id.id

    const project = await pool.query(
      `SELECT *
       FROM projects
       WHERE project_id = $1`,
       [num]
    );
    console.log(project.rows[0].project_image_path);
    const path = project.rows[0].project_image_path;
    res.sendFile(path, {root: '.'});
  } catch (error) {
    console.log(error.message);
    res.status(500).json('伺服器錯誤'); 
  }
})

// Buffer version
router.post('/new', upload.single('project_thumbnail'), async(req, res) => {
  console.log(req.file.path);
  var meta_json = JSON.parse(req.body.metadata);
  try {
    const { name, address, corporation, manager, inspector, email } = meta_json;
    const { buffer } = req.file;

    const newProject = await pool.query(
      `INSERT INTO projects (
        project_image,
        project_name,
        project_address,
        project_corporation,
        project_manager,
        project_inspector,
        project_email
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING *`,
      [ buffer, name, address, corporation, manager, inspector, email ]
    );

    console.log(newProject.rows[0]);

    res.json(newProject.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json('伺服器錯誤');
  }
});

router.get('/get/:id', async (req, res) => {
  console.log(req.params);
  try {
    const project = await pool.query(
      `SELECT *
       FROM projects
       WHERE project_id = $1`,
        [req.params.id]
    );
    console.log(project.rows[0]);
    res.contentType('image/jpeg');
    res.json({
      project_name: project.rows[0].project_name,
      project_corporation: project.rows[0].project_corporation,
      image: project.rows[0].project_image
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('伺服器錯誤');
  }
})

// 管理員:使用者資訊頁面/專案清單
router.get('/all', authorization, async(req, res) => {
  try {
    console.log(req.body);
    const allProjects = await pool.query(
      `SELECT *
       FROM projects
       ORDER BY project_corporation`
      );

    res.json(allProjects);  // 暫時將所有欄位回傳

  } catch (error) {

    console.log(`get all projects error: ${error}`);

    res.status(500).json("Server Error.");

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
router.get('/workOn/:id', authorization, async (req, res) => {
  let user_id = req.body.uuid;
  let user_name = req.body.name;
  try {
    
    const project_id = await pool.query(
      `SELECT project_id
       FROM worksOn
       WHERE user_id = $1`, [
      user_id
    ]);

    const projects = await pool.query('SELECT * FROM projects WHERE projects_id IN ');
  } catch (error) {
    console.log(`get projects for ${user_name} error: ${error}`);
  }
});

module.exports = router;
