const router = require('express').Router();
const { Router, json } = require('express');
const pool = require('../db');
const authorization = require('../middleware/authorization');

// 新增issue
router.post('/', authorization, async(req, res) => {
  try {
    console.log(req.body);
    const {
      issueViolationType,
      issueType,
      issueTrackingOrNot,
      issueLocation,
      issueResponsibleCorporation,
      issueAssignee,
      issueStatus
    } = req.body;

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
        issueViolationType,
        issueType,
        issueTrackingOrNot,
        issueLocation,
        issueResponsibleCorporation,
        issueAssignee,
        issueStatus
      ]
    );

    res.json(newIssue);
    res.json(`Insert successfully`);

  } catch (error) {
    res.status(500).json(`Server Error: ${error.message}`);
  }
});

// 依使用者資訊

module.exports = Router;
