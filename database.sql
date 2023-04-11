CREATE DATABASE smartconstruction;

-- set extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 公司(甲方)實體
CREATE TABLE corporations (
  corporation_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporation_name TEXT,
  corporation_manager TEXT,
  corporation_email TEXT,
  corporation_phone TEXT,
  project_id uuid REFERENCES projects (project_id)
);

CREATE TABLE roles (
  
);

CREATE TABLE role_permission (
  permission_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  permission_level TEXT NOT NULL,
  view_user BOOLEAN NOT NULL,
  add_user  BOOLEAN NOT NULL,
  update_user BOOLEAN NOT NULL,
  delete_user BOOLEAN NOT NULL,
  view_project BOOLEAN NOT NULL,
  add_project BOOLEAN NOT NULL,
  update_project BOOLEAN NOT NULL,
  delete_project BOOLEAN NOT NULL,
  view_issue BOOLEAN NOT NULL,
  add_issue BOOLEAN NOT NULL,
  update_issue BOOLEAN NOT NULL,
  delete_issue BOOLEAN NOT NULL,
  view_location BOOLEAN NOT NULL,
  add_location BOOLEAN NOT NULL,
  update_location BOOLEAN NOT NULL,
  delete_location BOOLEAN NOT NULL,
  view_manufacturer BOOLEAN NOT NULL,
  add_manufacturer BOOLEAN NOT NULL,
  update_manufacturer BOOLEAN NOT NULL,
  delete_manufacturer BOOLEAN NOT NULL,
  view_task BOOLEAN NOT NULL,
  add_task BOOLEAN NOT NULL,
  update_task BOOLEAN NOT NULL,
  delete_task BOOLEAN NOT NULL
);

INSERT INTO role_permission (
  permission_level,
  view_user,
  add_user,
  update_user,
  delete_user,
  view_project,
  add_project,
  update_project,
  delete_project,
  view_issue,
  add_issue,
  update_issue,
  delete_issue,
  view_location,
  add_location,
  update_location,
  delete_location,
  view_manufacturer,
  add_manufacturer,
  update_manufacturer,
  delete_manufacturer,
  view_task,
  add_task,
  update_task,
  delete_task
) VALUES (
  -- '管理員', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true
  '專案負責人', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true
  '專案使用者', true, true, false, false, true, false, false, false, true, true, true, true, true, true, false, false, true, true, false, false, true, true, false, false
  '訪客', true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false
);

CREATE TABLE user_role (

);

-- 使用者實體
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

-- 專案實體
CREATE TABLE projects (
  project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- project_image BYTEA,                                 -- 捨棄直接存在資料庫的選項
  project_image_path TEXT,                                -- 可能會有空值
  project_name TEXT NOT NULL,
  project_address TEXT NOT NULL,
  project_corporation TEXT NOT NULL,
  project_manager TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 使用者與專案多對多關係實體
CREATE TABLE works_on (
  works_on_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users (user_id),
  project_id uuid REFERENCES projects (project_id) ON DELETE CASCADE,
  manager BOOLEAN,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 缺失地點實體
CREATE TABLE locations (
  location_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects (project_id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  floor TEXT,
  position TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE manufacturers (
  manufacturer_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects (project_id) ON DELETE CASCADE,
  manufacturer_name TEXT,
  manufacturer_manager TEXT,
  manufacturer_email TEXT,
  manufacturer_phone TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 工項實體
CREATE TABLE tasks (
  task_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects (project_id) ON DELETE CASCADE,
  task_name TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 缺失實體
CREATE TABLE issues (
  issue_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),                 -- 缺失ID
  project_id uuid REFERENCES projects (project_id) ON DELETE CASCADE,   -- 屬於哪個project
  location_id uuid REFERENCES locations (location_id),                  -- 在哪個地點
  manufacturer_id uuid REFERENCES manufacturers (manufacturer_id),      -- 屬於哪個責任廠商
  task_id uuid REFERENCES tasks (task_id),                              -- 屬於哪個工項
  issue_image_path TEXT,                                                -- 缺失影像儲存路徑
  issue_image_width BIGINT,                                             -- 缺失影像寬
  issue_image_height BIGINT,                                            -- 缺失影像高
  issue_title_prev TEXT,                                                -- 模型自動辨識之缺失類別(not updated yet)
  issue_title TEXT,                                                     -- 缺失類別(not updated yet)
  issue_type_prev TEXT,
  issue_type TEXT,                                                      -- 缺失項目
  issue_caption_prev TEXT,                                          -- 模型自動辨識之缺失描述(not updated yet)
  issue_caption TEXT,                                              -- 缺失描述(not updated yet)
  tracking_or_not BOOLEAN,                                              -- 追蹤缺失
  issue_location TEXT,                                                  -- 缺失地點
  issue_manufacturer TEXT,                                              -- 責任廠商
  issue_penelty BIGINT,                                                 
  issue_deadline TIMESTAMP,
  issue_task TEXT,                                                      -- 工項類別
  issue_recorder TEXT,                                                  -- 記錄人員
  issue_status TEXT,                                                    -- 缺失風險程度
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 標註實體
-- 參考ntu-SCon-frontend/models/IssueLabel.js 中的定義
CREATE TABLE labels (
  label_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id uuid REFERENCES issues (issue_id) ON DELETE CASCADE,
  max_x FLOAT,
  max_y FLOAT,
  min_x FLOAT,
  min_y FLOAT,
  label_name TEXT,
  label_mode TEXT,
  label_path TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 缺失改善影像與備註實體
CREATE TABLE attachments (
  attachment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id uuid REFERENCES issues (issue_id) ON DELETE CASCADE,
  attachment_image_path TEXT,
  attachment_remark TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 責任歸屬實體
CREATE TABLE responsible_for (
  responsible_for_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporation_id uuid REFERENCES corporations (corporation_id),
  task_id uuid REFERENCES tasks (task_id),
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update 使用者權限
UPDATE users SET user_permission = '管理員';
UPDATE users SET user_job = '教授' WHERE user_name != 'Cody Chen';
UPDATE users SET user_job = '開發人員' WHERE user_name = 'Cody Chen';
UPDATE users SET user_cornpporation = '臺大BIM中心' WHERE user_name = 'Cody Chen';

DELETE FROM table_name WHERE condition;