CREATE DATABASE pernjwt;
CREATE DATABASE smartconstruction;

-- set extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 公司實體
CREATE TABLE corporations (
  corporation_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporation_name TEXT,
  corporation_manager TEXT,
  corporation_email TEXT,
  corporation_phone TEXT
);

-- 2. 使用者實體
CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  user_corporation TEXT NOT NULL,                   -- 是否預設選項?
  user_email TEXT NOT NULL,
  user_password TEXT NOT NULL,
  user_permission TEXT,                             -- 由管理員分配，不須有初始值
  user_job TEXT,                                    -- 由管理員分配，不須有初始值
  createAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updateAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  createAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updateAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  -- corporation_id uuid REFERENCES corporations (corporation_id)
);

-- 4. 使用者與專案多對多關係實體
CREATE TABLE works_on (
  works_on_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users (user_id),
  project_id uuid REFERENCES projects (project_id),
  manager BOOLEAN,
  createAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updateAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 缺失地點實體
CREATE TABLE locations (
  location_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_name TEXT NOT NULL,
  floor TEXT,
  position TEXT,
  createAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updateAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id uuid REFERENCES projects (project_id)
);

-- 6. 缺失所屬工項實體
CREATE TABLE tasks (
  task_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_name TEXT NOT NULL,
  createAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updateAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id uuid REFERENCES projects (project_id)
);

-- 7. 議題實體
CREATE TABLE issues (
  issue_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),   -- 缺失ID
  issue_image_path TEXT,                                  -- 可能會有空值
  issue_title TEXT,                                       -- 缺失類別
  issue_type TEXT,                                        -- 缺失項目
  tracking_or_not BOOLEAN,                                -- 追蹤缺失
  issue_location TEXT,                                    -- 缺失地點
  issue_manufacturer TEXT,                                -- 責任廠商
  issue_task TEXT,                                        -- 工項類別(選填)
  issue_assignee TEXT,                           -- 記錄人員(自動帶入App使用者名稱)
  issue_status TEXT,                                      -- 缺失狀態
  createAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updateAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id uuid REFERENCES projects (project_id)       -- 
);

-- 8. 責任歸屬實體
CREATE TABLE responsible_for (
  responsible_for_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporation_id uuid REFERENCES corporations (corporation_id),
  task_id uuid REFERENCES tasks (task_id)
);

-- Update
UPDATE users SET user_permission = '管理員';
UPDATE users SET user_job = '教授' WHERE user_name != 'Cody Chen';
UPDATE users SET user_job = '開發人員' WHERE user_name = 'Cody Chen';

-- insert default user : 無法通過密碼加密路徑
INSERT INTO users (
  user_corporation,
  user_name,
  user_email,
  user_password,
  user_permission,
  user_job
) VALUES ('臺大BIM中心', '林之謙', 'jacoblin@ntu.edu.tw', '123', '管理員', '教授');

INSERT INTO users (
  user_corporation,
  user_name,
  user_email,
  user_password,
  user_permission,
  user_job
) VALUES ('臺大BIM中心', '謝尚賢', 'sshsieh@gmail.com', '123', '管理員', '教授');

INSERT INTO users (
  user_name,
  user_corporation,
  user_email,
  user_password,
  user_permission,
  user_job
) VALUES ('臺大BIM中心', 'Cody Chen', 'cdxvy30@caece.net', '123', '管理員', '開發人員');