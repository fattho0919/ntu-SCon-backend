const router = require('express').Router();
const { Router, json } = require('express');
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');

// 新增issue
router.post('/', /*authorization,*/ async(req, res) => {
  try {
    console.log(req.body);
    const {
      violationType,
      issueType,
      issueTrack,
      issueLocationText,
      responsibleCorporation,
      issueAssigneeText,
      issueStatus,
    } = req.body;

    console.log(violationType);

    const newIssue = await pool.query(
      `INSERT INTO issues (
        issue_violation_type, 
        issue_type,
        tracking_or_not,
        issue_location,
        issue_responsible_corporation,
        issue_assignee,
        issue_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        violationType,
        issueType,
        issueTrack,
        issueLocationText,
        responsibleCorporation,
        issueAssigneeText,
        issueStatus,
      ]
    );

    // console.log(newIssue);
    res.json(`Insert successfully`);

  } catch (error) {
    res.status(500).json(`Server Error: ${error.message}`);
  }
});

// 依使用者資訊

module.exports = router;
