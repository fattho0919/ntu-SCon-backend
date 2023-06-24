CREATE DATABASE smartconstruction;

-- set extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/*
Todo:
- update_at 欄位設定 trigger
- corporation: enum type (archive)
- notification table
*/

CREATE TABLE corporations (
  corporation_id SERIAL PRIMARY KEY,
  corporation_name TEXT NOT NULL,
  corporation_type TEXT NOT NULL,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 拆分監造、營造為不同公司種類
INSERT INTO corporations (corporation_name, corporation_type) VALUES
('世曦工程顧問股份有限公司', '營造公司'),
('豐譽營造股份有限公司', '營造公司'),
('瑞助營造股份有限公司', '營造公司'),
('建國工程股份有限公司', '營造公司'),
('世曦工程顧問股份有限公司', '監造公司');

/*
CREATE TABLE constructions (
  construction_id SERIAL PRIMARY KEY,
  construction_name TEXT NOT NULL,
  FOREIGN KEY (construction_id) REFERENCES corporations(corporation_id)
);

CREATE TABLE supervisions (
  supervision_id SERIAL PRIMARY KEY,
  supervision_name TEXT NOT NULL,
  FOREIGN KEY (supervision_id) REFERENCES corporations(corporation_id)
);

CREATE TABLE contractors (
  contractor_id SERIAL PRIMARY KEY,
  contractor_name TEXT NOT NULL,
  FOREIGN KEY (contractor_id) REFERENCES corporations(corporation_id)
);
*/

CREATE TABLE role_permission (
  permission_level TEXT NOT NULL PRIMARY KEY,
  view_corporation BOOLEAN NOT NULL,
  add_corporation BOOLEAN NOT NULL,
  update_corporation BOOLEAN NOT NULL,
  delete_corporation BOOLEAN NOT NULL,
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

INSERT INTO role_permission VALUES
('開發者', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
('管理員', false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
('專案管理員', false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
('專案使用者', false, false, false, false, true, true, false, false, true, false, false, false, true, true, true, true, true, true, false, false, true, true, false, false, true, true, false, false),
('訪客', false, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false);

CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_password TEXT NOT NULL,
  user_job TEXT,
  corporation_id INT REFERENCES corporations (corporation_id),
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_role (
  user_id uuid REFERENCES users(user_id),
  permission_level TEXT REFERENCES role_permission(permission_level),
  PRIMARY KEY (user_id, permission_level),
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
  project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_image_path TEXT,
  project_name TEXT NOT NULL,
  project_address TEXT NOT NULL,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE engage (
  engage_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporation_id INT NOT NULL,
  project_id uuid NOT NULL,
  host BOOLEAN,
  FOREIGN KEY (corporation_id) REFERENCES corporations(corporation_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id),
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE participate (
  participate_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users (user_id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects (project_id) ON DELETE CASCADE,
  manager BOOLEAN,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE locations (
  location_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects (project_id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  floor TEXT,
  position TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tasks (
  task_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects (project_id) ON DELETE CASCADE,
  task_name TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE issues (
  issue_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),                 -- 缺失ID
  project_id uuid REFERENCES projects (project_id) ON DELETE CASCADE,   -- 屬於哪個project
  location_id uuid REFERENCES locations (location_id) ON DELETE CASCADE,-- 在哪個地點
  task_id uuid REFERENCES tasks (task_id) ON DELETE CASCADE,            -- 屬於哪個工項
  issue_image_path TEXT,                                                -- 缺失影像儲存路徑
  issue_image_width BIGINT,                                             -- 缺失影像寬
  issue_image_height BIGINT,                                            -- 缺失影像高
  issue_title_prev TEXT,                                                -- 模型自動辨識之缺失類別(not updated yet)
  issue_title TEXT,                                                     -- 缺失類別(not updated yet)
  issue_type_prev TEXT,
  issue_type TEXT,                                                      -- 缺失項目
  issue_caption_prev TEXT,                                              -- 模型自動辨識之缺失描述(not updated yet)
  issue_caption TEXT,                                                   -- 缺失描述(not updated yet)
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

CREATE TABLE attachments (
  attachment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id uuid REFERENCES issues (issue_id) ON DELETE CASCADE,
  attachment_image_path TEXT,
  attachment_remark TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 以多對多關係保留未來新增代雇工廠商功能的彈性
CREATE TABLE responsible_for (
  responsible_for_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporation_id INT REFERENCES corporations (corporation_id),
  issue_id uuid REFERENCES issues (issue_id),
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE produce (
  produce_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporation_id INT REFERENCES corporations (corporation_id),
  task_id uuid REFERENCES tasks (task_id),
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
  notify_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid REFERENCES users (user_id),
  receiver_id uuid REFERENCES users (user_id),
  notify_msg TEXT,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update 使用者權限
UPDATE users SET user_permission = '管理員';
UPDATE users SET user_job = '開發人員' WHERE user_name = '何宏發';
UPDATE user_role SET permission_level = '管理員' WHERE user_id = (SELECT user_id FROM users WHERE user_name = '何宏發');

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

ALTER TABLE <table_name> RENAME TO <new_name>;
ALTER TABLE <table_name> RENAME COLUMN <current_name> TO <new_name>;

DELETE FROM table_name WHERE condition;