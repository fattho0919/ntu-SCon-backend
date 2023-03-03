const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');
const multer = require('multer');

// 備註(remark)要跟issue名稱綁定
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './images/');
  },
  filename: function (req, file, callback) {
    let corporationName = JSON.parse(req.body.metadata).projectCorporation;
    let projectName = JSON.parse(req.body.metadata).projectName;
    let t = new Date(Date.now() + 28800000).toISOString();  // 轉換為yyyy-mm-ddThh:mm:ss.msZ的格式
    callback(
      null,
      corporationName + '_' + projectName + '_' + 'attachment' + '_' + t + '.jpg'
    );
  }
});

const upload = multer({storage: storage});

router.post('/add/:issueId', upload.single('attachment'), async (req, res) => {
  try {
    const body = JSON.parse(req.body.metadata);
    const issue_id = req.params.issueId;
    const { path } = req.file;

    const newAttachment = await pool.query(
      `INSERT INTO attachments (
        issue_id,
        attachment_image_path
      ) VALUES (
        $1, $2
      ) RETURNING *`, [
        issue_id, path
      ]
    );

    console.log(newAttachment.rows);
    // res.json({
    //   attachment_id: newAttachment.rows[0].attachment_id,
    //   path: newAttachment.rows[0].attachment_image_path,
    //   message: '新增缺失改善後圖片成功',
    // });
    res.json(newAttachment.rows[0]);

  } catch (error) {
    res.status(500).json(`Add attachment error: ${error}`);
  }
});

router.get('/list/:issueId', async (req, res) => {
  try {
    const issue_id = req.params.issueId;

    const attachments = await pool.query(
      `SELECT *
       FROM attachments
       WHERE issue_id = $1`, [
        issue_id
      ]
    );

    if (attachments.rows[0])
      res.json(attachments.rows[0]);
    else
      res.json();

  } catch (error) {
    res.status(500).json(`List attachments error: ${error}`);
  }
})

router.get('/get/thumbnail/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const attachment_thumbnail = await pool.query(
      `SELECT attachment_image_path
       FROM attachments
       WHERE attachment_id = $1`, [
        id
      ]
    );

    const path = attachment_thumbnail.rows[0].attachment_image_path;
    res.sendFile(path, {root: '.'});

  } catch (error) {
    res.status(500).json(`Get attachment thumbnail error: ${error}`);
  }
});

module.exports = router;
