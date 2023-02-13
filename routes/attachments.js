const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');
const multer = require('multer');

// 備註(remark)要跟issue名稱綁定
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(req.body);
    callback(null, './images/');
  },
  filename: function (req, file, callback) {
    console.log(JSON.parse(req.body.metadata));
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

router.post('/add/:issueId', upload.single('attachment'), async (req, res) => {
  try {
    


  } catch (error) {
    console.log(`Add attachment error: ${error}`);
  }
});


module.exports = router;
