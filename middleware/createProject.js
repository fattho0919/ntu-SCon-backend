const router = require('express').Router();
const res = require('express/lib/response');
const pool = require('../services/pool');

module.exports = async (req, res, next) => {
  console.log(req);
  try {
    const { name, address, corporation, manager, inspector, email } = req.metadata;
    console.log(name);
    console.log(address);
    console.log(corporation);
    console.log(manager);
    console.log(inspector);
    console.log(email);

    const newProject = await pool.query(
      `INSERT INTO projects (
        project_name,
        project_address,
        project_corporation,
        project_manager,
        project_inspector,
        project_email
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      ) RETURNING *`,
      [ name, address, corporation, manager, inspector, email ]
    );

    console.log(newProject.rows[0]);
    // @Return ID to let image can append in column
    next(newProject.rows[0]);

  } catch (error) {
    console.log(error.message);
    res.status(500).json('伺服器錯誤');
  }
};
