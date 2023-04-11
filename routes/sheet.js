const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');
const xl = require('excel4node');
const wb = new xl.Workbook();

router.get('/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Select all issues
    const data = await pool.query(
      `SELECT * FROM issues WHERE project_id = $1`,
      [projectId]
    );

    // **************************************** //
    // Write code here 


    // **************************************** //

    // Response excel file
    wb.write('ExcelFile.xlsx', res);

  } catch (error) {
    res.status(500).json('伺服器錯誤');
  }
});

module.exports = router;
