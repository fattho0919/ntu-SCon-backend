const router = require('express').Router();
const pool = require('../services/pool');
const authorization = require('../middleware/authorization');
var xl = require('excel4node');

// const status = ['無風險', '有風險，須改善', '有風險，須立即改善'];

router.get('/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Select all issues
    const issue_data = await pool.query(
      `SELECT * FROM issues WHERE project_id = $1`,
      [projectId]
    );

    // Select projects information
    const project_data = await pool.query(
      `SELECT * FROM projects WHERE project_id = $1`,
      [projectId]
    );

    // Select all corporation
    // const corporation_data = await pool.query(
    //   `SELECT * FROM corporations WHERE project_id = $1`,
    //   [projectId]
    // );

    // Select attachment information
    const attachment_data = await Promise.all(issue_data.rows.map(
      async (issue) => {
        const result = await pool.query(
          `SELECT attachment_remark, attachment_image_path, update_at FROM attachments WHERE issue_id = $1`,
          [issue.issue_id]
        );
        return result.rows[0];
      }
    ));

    // **************************************** //
    // Write code here 

    var wb = new xl.Workbook();
    var ws_options = {
      pageSetup:{
        paperSize: 'A4_PAPER'
      },
      printOptions:{
        centerHorizontal: true
      },
    };

    var ws = wb.addWorksheet('改善前後', ws_options);

    var h1_style = wb.createStyle({
      alignment: {
        horizontal: ['center'],
        vertical: ['center']
      },
      font: {
        bold: true,
        color: '000000',
        size: 20,
        name: 'Courier',
      },
    });

    var h2_style = wb.createStyle({
      alignment: {
        horizontal: ['center'],
        vertical: ['center'],
        wrapText: true
      },
      font: {
        bold: true,
        color: '000000',
        size: 15,
        name: 'Courier',
      },
    });

    var title_style = wb.createStyle({
      alignment: {
        horizontal: ['center'],
        vertical: ['center'],
      },
      font: {
        color: '000000',
        size: 15,
        name: 'Courier',
      },
      border: {
        left: {style: 'thin', color: '000000'}, 
        top: {style: 'thin', color: '000000'}, 
        right: {style: 'thin', bottom: '000000'}, 
        bottom: {style: 'thin', color: '000000'}
      },
    });

    var text_style = wb.createStyle({
      alignment: {
        horizontal: ['left'],
        vertical: ['center'],
        wrapText: true
      },
      font: {
        color: '000000',
        size: 15,
        name: 'Courier',
      },
      border: {
        left: {style: 'thin', color: '000000'}, 
        top: {style: 'thin', color: '000000'}, 
        right: {style: 'thin', bottom: '000000'}, 
        bottom: {style: 'thin', color: '000000'}
      },
    });

    for (let i = 0; i < issue_data.rows.length; i++){
      ws.cell(1+42*i, 1, 2+42*i, 7, true)
        .string(`${project_data.rows[0].project_corporation}-缺失改善前後記錄表`)
        .style(h1_style);
    
      ws.cell(3+42*i, 1, 4+42*i, 7, true)
        .string(`工程名稱: ${project_data.rows[0].project_name} 工地負責人: ${!!project_data.rows[0].project_manager ? project_data.rows[0].project_manager : '未設定'}`)
        .style(h2_style);

      ws.cell(5+42*i, 1, 6+42*i, 7, true)
        .string(`地址: ${project_data.rows[0].project_address} 日期區間: ${'還沒寫好'}`)
        .style(h2_style);

      ws.cell(7+42*i, 1, 8+42*i, 1, true)
        .string("責任廠商")
        .style(title_style).style({font: {bold: true}});

      ws.cell(7+42*i, 2, 8+42*i, 4, true)
        .string(`${issue_data.rows[i].issue_manufacturer}`)
        .style(title_style);

      ws.cell(7+42*i, 5, 8+42*i, 5, true)
        .string("記錄人員")
        .style(title_style).style({font: {bold: true}});

      ws.cell(7+42*i, 6, 8+42*i, 7, true)
        .string(`${issue_data.rows[i].issue_recorder}`)
        .style(title_style);

      ws.cell(9+42*i, 1, 10+42*i, 1, true)
        .string("缺失地點")
        .style(title_style).style({font: {bold: true}});

      ws.cell(9+42*i, 2, 10+42*i, 4, true)
        .string(`${issue_data.rows[i].issue_location}`)
        .style(title_style);

      ws.cell(9+42*i, 5, 10+42*i, 5, true)
        .string("發現日期")
        .style(title_style).style({font: {bold: true}});

      ws.cell(9+42*i, 6, 10+42*i, 7, true)
        .string(`${new Date(issue_data.rows[i].create_at).toLocaleDateString()}`)
        .style(title_style);
      
      ws.cell(11+42*i, 1, 25+42*i, 1, true)
        .string("改善前")
        .style(title_style).style({font: {bold: true}});

      ws.addImage({
        path: `${issue_data.rows[i].issue_image_path}`,
        type: 'picture',
        position: {
          type: 'twoCellAnchor',
          from: {
            col: 2,
            colOff: 0,
            row: 13+42*i,
            rowOff: 0,
          },
          to: {
            col: 6,
            colOff: 0,
            row: 24+42*i,
            rowOff: 0,
          },
        },
      });
      
      ws.cell(11+42*i, 6, 11+42*i, 7, true)
        .string("缺失類別")
        .style(title_style).style({font: {bold: true}});

      ws.cell(12+42*i, 6, 13+42*i, 7, true)
        .string(`${issue_data.rows[i].issue_title}`)
        .style(text_style);

      ws.cell(14+42*i, 6, 14+42*i, 7, true)
        .string("缺失項目")
        .style(title_style).style({font: {bold: true}});

      ws.cell(15+42*i, 6, 18+42*i, 7, true)
        .string(`${issue_data.rows[i].issue_type}`)
        .style(text_style);

      ws.cell(19+42*i, 6, 19+42*i, 7, true)
        .string("缺失描述")
        .style(title_style).style({font: {bold: true}});

      ws.cell(20+42*i, 6, 25+42*i, 7, true)
        .string(`${issue_data.rows[i].issue_caption}`)
        .style(text_style);

      //改善後
      ws.cell(26+42*i, 1, 40+42*i, 1, true)
        .string("改善後")
        .style(title_style).style({font: {bold: true}});

      //判定改善資料是否存在
      {
        attachment_data[i] ? 
        ws.addImage({
          path: `${attachment_data[i].attachment_image_path}`,
          type: 'picture',
          position: {
            type: 'twoCellAnchor',
            from: {
              col: 2,
              colOff: 0,
              row: 28+42*i,
              rowOff: 0,
            },
            to: {
              col: 6,
              colOff: 0,
              row: 39+42*i,
              rowOff: 0,
            },
          },
        })
        :
        ws.cell(28+42*i, 2, 38+42*i, 5, true)
        .string("未改善")
        .style(title_style);
      }
      
      ws.cell(26+42*i, 6, 26+42*i, 7, true)
        .string("改善日期")
        .style(title_style).style({font: {bold: true}});

      ws.cell(27+42*i, 6, 28+42*i, 7, true)
        .string(`${!!attachment_data[i] ? new Date(attachment_data[i].update_at).toLocaleDateString() : '未改善'}`)
        .style(text_style);

      ws.cell(29+42*i, 6, 29+42*i, 7, true)
        .string("備註")
        .style(title_style).style({font: {bold: true}});

      ws.cell(30+42*i, 6, 40+42*i, 7, true)
        .string(`${!!attachment_data[i] ? attachment_data[i].attachment_remark : '無'}`)
        .style(text_style);

      


      //border封底
      ws.cell(25+42*i, 2, 25+42*i, 5)
        .style({border: {bottom: {style: 'thin', color: '000000'}}})
      ws.cell(40+42*i, 2, 40+42*i, 5)
        .style({border: {bottom: {style: 'thin', color: '000000'}}})
      ws.addPageBreak('row', 42+42*i);
    }
    
    // **************************************** //
    // Response excel file
    wb.write(`ExcelFile.xlsx`, res);

  } catch (error) {
    res.status(500).json('伺服器錯誤');
  }
});

module.exports = router;