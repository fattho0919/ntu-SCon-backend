const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../src/middleware/authorization');
const multer = require('multer');

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

router.post('/', upload.single('project_thumbnail'), async(req, res) => {
  try {
    var meta_json = JSON.parse(req.body.metadata);
    console.log(meta_json);
    const { name, address, managerID, corporation } = meta_json;
    const { path } = req.file;

    const newProject = await pool.query(
      `INSERT INTO projects (
        project_image_path,
        project_name,
        project_address
      ) VALUES (
        $1, $2, $3
      ) RETURNING *`,
      [ path, name, address ]
    );

    // 預設發起專案者即專案管理員
    const assign_manager = await pool.query(
      `
      INSERT INTO participate (user_id, project_id, manager)
      VALUES ($1, $2, $3)
      `,
      [ managerID, newProject.rows[0].project_id, true ]
    );

    const host_corporation_id = await pool.query(
      `
      SELECT corporation_id
      FROM corporations
      WHERE corporation_name = $1
      `,
      [corporation]
    );

    // 預設發起專案者所屬公司即專案所屬公司
    const engage = await pool.query(
      `
      INSERT INTO engage (corporation_id, project_id)
      VALUES ($1, $2)
      `,
      [ 
        host_corporation_id.rows[0].corporation_id,
        newProject.rows[0].project_id
      ]
    );
    // console.log(engage.rows);

    res.json({
      path: newProject.rows[0].project_image_path,
      message: '新增專案成功',
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json('伺服器錯誤');
  }
});

router.patch('/:id', upload.single('project_thumbnail'), async (req, res) => {
  try {
    var meta_json = JSON.parse(req.body.metadata);
    console.log(meta_json);
    const { name, address } = meta_json;
    const projectId = req.params.id;

    const updateProject = await pool.query(
      `UPDATE projects
       SET project_name = $1, project_address = $2
       WHERE project_id = $3
       RETURNING *`,
      [ name, address, projectId ]
    );
    
    res.json({
      path: updateProject.rows[0].project_image_path,
      message: '更新專案成功'
    })

  } catch (error) {
    console.log(error);
    res.status(500).json('伺服器錯誤');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;

    const deleteProject = await pool.query(
      `DELETE FROM projects WHERE project_id = $1`,
      [projectId]
    );
    
    res.json({
      message: `刪除專案成功`
    });

  } catch (error) {
    console.log(error);
    res.status(500).json('伺服器錯誤');
  }
});

router.get('/all', async(req, res) => {
  try {
    const allProjects = await pool.query(
      `SELECT * FROM projects`
    );
    // console.log(allProjects.rows);
    res.json(allProjects.rows);
  } catch (error) {
    console.log(`Get all projects error: ${error}`);
    res.status(500).json("Server Error.");
  }  
});

router.get('/thumbnail/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const project = await pool.query(
      `SELECT project_image_path
       FROM projects
       WHERE project_id = $1`,[
        id
      ]
    );
    // console.log(project.rows[0].project_image_path);
    const path = project.rows[0].project_image_path;
    res.sendFile(path, {root: '.'});
  } catch (error) {
    console.log(error.message);
    res.status(500).json('伺服器錯誤');
  }
});

router.get('/participate/:userId', async (req, res) => {
  try {
    let userId = req.params.userId;
    
    const project_id = await pool.query(
      `
      SELECT project_id
      FROM participate
      WHERE user_id = $1
      `, 
      [ userId ]
    );

    let selected_project_id = project_id.rows[0].project_id;

    // const participants = await pool.query(
    //   `SELECT * FROM participate WHERE project_id = $1`,
    //   [ selected_project_id ]
    // );

    // let count = participants.rows.length;
    // console.log(count);

    const selected_project = await pool.query(
      `SELECT * FROM projects WHERE project_id = $1`,
      [ selected_project_id ]
    );
    
    // console.log(selected_project.rows);
    res.json(selected_project.rows);

  } catch (error) {
    console.log(`Get projects error: ${error}`);
    res.status(500).json('伺服器錯誤');
  }
});

router.get('/:corporation', async (req, res) => {
  try {
    let corporation = req.params.corporation;

    const corporation_id = await pool.query(
      `SELECT corporation_id FROM corporations WHERE corporation_name = $1`,
      [ corporation ]
    );
    // console.log(corporation_id.rows[0]);
    let corporationID = corporation_id.rows[0].corporation_id;

    const project_id = await pool.query(
      `SELECT * FROM engage WHERE corporation_id = $1`,
      [ corporationID ]
    );
    // console.log(project_id.rows);
    let projectID = project_id.rows[0].project_id;

    const projectsList = await pool.query(
      `SELECT * FROM projects WHERE project_id = $1`,
      [ projectID ]
    );

    // console.log(projectsList.rows);
    res.json(projectsList.rows);

  } catch (error) {
    console.log(error);
    res.status(500).json('伺服器錯誤');    
  }
});

module.exports = router;
