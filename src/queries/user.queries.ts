export const existingUserQuery = "SELECT * FROM users WHERE email=$1;";
export const addUserQuery =
  "INSERT INTO users (email,password,role) VALUES ($1,$2,$3) RETURNING id; ";

export const updateRefreshTokenQuery =
  "UPDATE users SET refreshToken=$1 WHERE id=$2";

export const userByIdQuery = "SELECT * FROM users WHERE id=$1";
