export const existingUserQuery = "SELECT * FROM users WHERE email=$1;";
export const addUserQuery =
  "INSERT INTO users (email,password,role,user_id,created_at) VALUES ($1,$2,$3,$4,$5) ; ";

export const updateRefreshTokenQuery =
  "UPDATE users SET refreshToken=$1 WHERE user_id=$2";

export const userByIdQuery = "SELECT * FROM users WHERE user_id=$1";
