CREATE DATABASE pernjwt;

-- Table : users
-- set extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT
  uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_corporation VARCHAR(255) NOT NULL, -- 是否預設選項?
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_permission VARCHAR(255), -- 由管理員分配，不須有初始值
  createAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updateAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bind users and projects
CREATE TABLE worksOn (
  relation_id SERIAL PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
);

-- Table : projects
CREATE TABLE projects(
  project_id SERIAL PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  project_address VARCHAR(255) NOT NULL,
  project_corporation VARCHAR(255) NOT NULL,
  project_manager VARCHAR(255) NOT NULL,
  project_inspector VARCHAR(255) NOT NULL,
  project_email VARCHAR(255) NOT NULL,
  -- user_id VARCHAR(255),
  createAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updateAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bind projects and issues
CREATE TABLE issuesOn (
  relation_id SERIAL PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL,
  issue_id TEXT NOT NULL,
);


-- Issues: 議題
CREATE TABLE issues (
  issue_id SERIAL PRIMARY KEY,  -- 缺失ID
  issue_violation_type TEXT NOT NULL, -- 缺失類別
  issue_type TEXT NOT NULL, -- 缺失項目
  tracking_or_not BOOLEAN NOT NULL, -- 追蹤缺失
  issue_location TEXT NOT NULL, -- 缺失地點
  issue_responsible_corporation TEXT NOT NULL, -- 責任廠商
  -- issue_task TEXT, -- 工項(選填)
  issue_assignee TEXT NOT NULL, -- 記錄人員(自動帶入App使用者名稱)
  issue_status TEXT NOT NULL, -- issue狀態
  createAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updateAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  -- 缺失改善照片/議題照片 
);

-- Tasks: 工項
CREATE TABLE tasks (
  task_id SERIAL PRIMARY KEY,

);

-- insert default user
INSERT INTO users (
  user_name,
  user_corporation,
  user_email,
  user_password,
  user_permission
) VALUES ('林之謙', 'jacoblin@ntu.edu.tw', '123', '臺大BIM中心', '管理員');