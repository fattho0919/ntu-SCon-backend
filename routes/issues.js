const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(req.body);
    callback(null, './images/');
  },
  filename: function (req, file, callback) {
    console.log(JSON.parse(req.body.metadata));
    let corporationName = JSON.parse(req.body.metadata).projectCorporation;
    let projectName = JSON.parse(req.body.metadata).projectName;
    let d = new Date(Date.now() + 28800000).toISOString();
    callback(
      null,
      corporationName + '_' + projectName + '_' + 'issue' + '_' + d + '.jpg'
    );
  }
})

const upload = multer({storage: storage});

// 新增issue
router.post('/add', upload.single('issue'), async(req, res) => {
  try {
    console.log(req.body);
    var meta_json = JSON.parse(req.body.metadata);
    const {
      violationType,
      issueType,
      issueTrack,
      issueLocationText,
      responsibleCorporation,
      issueTaskText,
      issueAssigneeText,
      issueStatus,
      projectId
    } = meta_json;
    const { path } = req.file;

    const newIssue = await pool.query(
      `INSERT INTO issues (
        issue_image_path,
        issue_title, 
        issue_type,
        tracking_or_not,
        issue_location,
        issue_manufacturer,
        issue_task,
        issue_assignee,
        issue_status,
        project_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *`,
      [
        path,
        violationType,
        issueType,
        issueTrack,
        issueLocationText,
        responsibleCorporation,
        issueTaskText,
        issueAssigneeText,
        issueStatus,
        projectId
      ]
    );

    console.log(newIssue.rows[0]);
    res.json({
      path: newIssue.rows[0].issue_image_path,
      message: '新增缺失成功'
    });

  } catch (error) {
    res.status(500).json(`Server Error: ${error.message}`);
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
    
  }
})



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

    console.log(issuesList.rows);
    res.json(issuesList.rows);

  } catch (error) {
    console.log(`List issues error: ${error}`);
  }
})

module.exports = router;
