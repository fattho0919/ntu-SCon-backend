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
  user_id VARCHAR(255),
  createAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updateAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bind projects and issues
CREATE TABLE issuesOn (
  relation_id SERIAL PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL,
  issue_id TEXT NOT NULL,
);


-- Issues
CREATE TABLE issues (
  issue_id SERIAL PRIMARY KEY,
  tracking_or_not BOOLEAN NOT NULL,
  issue_location TEXT NOT NULL,
  issue_activity TEXT NOT NULL, -- 缺失
);

-- insert fake user
INSERT INTO users (user_name, user_email, user_password, user_corporation) VALUES ('cdxvy30', 'cdxvy30@gmail.com', '12345678', 'Archi');