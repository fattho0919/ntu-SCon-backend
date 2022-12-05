CREATE DATABASE pernjwt;

-- set extension
CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT
  uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_corporation VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_permission VARCHAR(255),
  createAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updateAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- insert fake user
INSERT INTO users (user_name, user_email, user_password, user_corporation) VALUES ('cdxvy30', 'cdxvy30@gmail.com', '12345678', 'Archi');