const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // console.log(req.body);
    callback(null, './images/');
  },
  filename: function (req, file, callback) {
    // console.log(JSON.parse(req.body.metadata));
    let corporationName = JSON.parse(req.body.metadata).projectCorporation;
    let projectName = JSON.parse(req.body.metadata).projectName;
    let t = new Date(Date.now() + 28800000).toISOString();  // 轉換為yyyy-mm-ddThh:mm:ss.msZ的格式
    callback(
      null,
      corporationName + '_' + projectName + '_' + 'issue' + '_' + t + '.jpg'
    );
  }
});

const upload = multer({storage: storage});

// 新增issue
router.post('/add', upload.single('issue'), async(req, res) => {
  try {
    console.log(req.body);
    var meta_json = JSON.parse(req.body.metadata);
    const {
      issue_image_width,        // 缺失影像寬
      issue_image_height,       // 缺失影像高
      violationType,               // 缺失類別
      issueType,                // 缺失項目
      issueTrack,               // 追蹤缺失
      issueLocation,            // 追蹤地點
      issueManufacturer,        // 責任廠商
      issueTask,                // 工項
      issueRecorder,            // 紀錄者(App使用者)
      issueStatus,              // 缺失風險高低
      projectId                 // 所屬專案
    } = meta_json;
    const { path } = req.file;

    const newIssue = await pool.query(
      `INSERT INTO issues (
        issue_image_path,
        issue_image_width,
        issue_image_height,
        issue_title, 
        issue_type,
        tracking_or_not,
        issue_location,
        issue_manufacturer,
        issue_task,
        issue_recorder,
        issue_status,
        project_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) RETURNING *`,
      [
        path,
        issue_image_width,
        issue_image_height,
        violationType,
        issueType,
        issueTrack,
        issueLocation,
        issueManufacturer,
        issueTask,
        issueRecorder,
        issueStatus,
        projectId
      ]
    );

    res.json({
      issue_id: newIssue.rows[0].issue_id,
      path: newIssue.rows[0].issue_image_path,
      message: '新增缺失成功'
    });

  } catch (error) {
    res.status(500).json(`伺服器錯誤: ${error.message}, 請稍後再試`);
  }
});

router.get('/get/thumbnail/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const issue = await pool.query(
      `SELECT issue_image_path
       FROM issues
       WHERE issue_id = $1`, [
        id
      ]
    );

    console.log(issue.rows[0].issue_image_path);
    const path = issue.rows[0].issue_image_path;
    res.sendFile(path, {root: '.'});

  } catch (error) {
    console.log();
  }
})

// 更新issue
router.patch('/update/:issueId', async (req, res) => {
  try {
    console.log(req.body);
    const issue_id = req.params.issueId;
    // var update_data = JSON.parse(req.body);
    // console.log(update_data);
    const {
      violationType,               // 缺失類別
      issueType,                // 缺失項目
      issueTrack,               // 追蹤缺失
      issueLocation,        // 追蹤地點
      responsibleCorporation,   // 責任廠商
      issueTask,            // 工項
      issueRecorder,            // 紀錄者(App使用者)
      issueStatus,              // 缺失風險高低
      projectId                 // 所屬專案
    } = req.body;

    const updateIssue = await pool.query(
      `UPDATE issues
       SET issue_title = $1,
           issue_type = $2,
           tracking_or_not = $3,
           issue_location = $4,
           issue_manufacturer = $5,
           issue_task = $6,
           issue_recorder = $7,
           issue_status = $8
       WHERE issue_id = $9
      `, [
        violationType,            // 缺失類別
        issueType,                // 缺失項目
        issueTrack,               // 追蹤缺失
        issueLocation,        // 追蹤地點
        responsibleCorporation,   // 責任廠商
        issueTask,            // 工項
        issueRecorder,            // 紀錄者(App使用者)
        issueStatus,              // 缺失風險高低
        issue_id
      ]
    );

    res.json('更新缺失成功');

  } catch (error) {
    console.log(error);
    res.status(500).json(`伺服器錯誤: ${error.message}, 請稍後再試`);
  }
});

// 刪除issue
router.delete('/delete/:issueId', async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error);
    res.status(500).json(`伺服器錯誤: ${error.message}, 請稍後再試`);
  }
});

// 依使用者資訊
router.get('/list/:projectId', async (req, res) => {
  try {
    let project_id = req.params.projectId;

    const issuesList = await pool.query(
      `SELECT *
       FROM issues
       WHERE project_id = $1`, [
        project_id
      ]
    );
    // console.log(issuesList.rows);
    res.json(issuesList.rows);

  } catch (error) {
    console.log(`伺服器錯誤: ${error}, 請稍後再試`);
  }
})

module.exports = router;
