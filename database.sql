CREATE DATABASE smartconstruction;

-- set extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 公司實體
CREATE TABLE corporations (
  corporation_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporation_name TEXT,
  corporation_manager TEXT
  -- corporation_email TEXT,
  -- corporation_phone TEXT
);  -- 後兩者應獨立於使用者實體

-- 2. 使用者實體
CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  user_corporation TEXT NOT NULL,                   -- 是否預設選項?
  user_email TEXT NOT NULL,
  user_password TEXT NOT NULL,
  user_permission TEXT,                             -- 由管理員分配，不須有初始值
  user_job TEXT,                                    -- 由管理員分配，不須有初始值
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  -- corporation_id uuid REFERENCES corporations (corporation_id)
);

-- 3. 專案實體
CREATE TABLE projects (
  project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- project_image BYTEA,                                 -- 捨棄直接存在資料庫的選項
  project_image_path TEXT,                                -- 可能會有空值
  project_name TEXT NOT NULL,
  project_address TEXT NOT NULL,
  project_corporation TEXT NOT NULL,
  project_manager TEXT,
  -- project_inspector TEXT NOT NULL,                     -- 不需要有專案紀錄人員
  -- project_email TEXT NOT NULL,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  -- corporation_id uuid REFERENCES corporations (corporation_id)
);

-- 4. 使用者與專案多對多關係實體
CREATE TABLE works_on (
  works_on_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users (user_id),
  project_id uuid REFERENCES projects (project_id),
  manager BOOLEAN,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 缺失地點實體
CREATE TABLE locations (
  location_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_name TEXT NOT NULL,
  floor TEXT,
  position TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id uuid REFERENCES projects (project_id)
);

-- 6. 缺失所屬工項實體
CREATE TABLE tasks (
  task_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_name TEXT NOT NULL,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id uuid REFERENCES projects (project_id)
);

-- 7. 缺失實體
-- 參考ntu-SCon-frontend/models/Issue.js 中對屬性的定義
CREATE TABLE issues (
  issue_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),   -- 缺失ID
  issue_image_path TEXT,                                  -- 缺失影像儲存路徑
  issue_image_width BIGINT,                               -- 缺失影像寬
  issue_image_height BIGINT,                              -- 缺失影像高
  issue_title TEXT,                                       -- 缺失類別
  issue_type TEXT,                                        -- 缺失項目
  issue_typeRemark TEXT,                                  -- 若缺失類別為"其他""，需自行輸入
  issue_track BOOLEAN,                                -- 追蹤缺失
  issue_location TEXT,                                    -- 缺失地點
  issue_manufacturer TEXT,                                -- 責任廠商
  issue_task TEXT,                                        -- 工項類別(選填)
  issue_recorder TEXT,                                    -- 記錄人員(自動帶入App使用者名稱)
  issue_status TEXT,                                      -- 缺失風險高低
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id uuid REFERENCES projects (project_id),       -- 屬於哪個project
  location_id uuid REFERENCES locations (location_id)     -- 在哪個地點
);

-- 8. 標註實體
-- 參考ntu-SCon-frontend/models/IssueLabel.js 中對屬性的定義
CREATE TABLE labels (
  label_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id uuid REFERENCES issues (issue_id),
  max_x BIGINT,
  max_y BIGINT,
  min_x BIGINT,
  min_y BIGINT,
  label_name TEXT,
  label_mode TEXT,
  label_path TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 缺失改善影像與備註實體
CREATE TABLE attachments (
  attachment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id uuid REFERENCES issues (issue_id),
  attachment_image_path TEXT,
  attachment_remark TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 責任歸屬實體
CREATE TABLE responsible_for (
  responsible_for_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporation_id uuid REFERENCES corporations (corporation_id),
  task_id uuid REFERENCES tasks (task_id)
);


11. 缺失類別實體(靜態)
CREATE TABLE violation_type (

);

-- Update 使用者權限
UPDATE users SET user_permission = '管理員';
UPDATE users SET user_job = '教授' WHERE user_name != 'Cody Chen';
UPDATE users SET user_job = '開發人員' WHERE user_name = 'Cody Chen';