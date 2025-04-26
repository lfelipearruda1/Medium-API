import db from "../connect.js";
import bcrypt from "bcrypt";

export const findUserByEmail = async (email) => {
  const result = await db.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
  return result.rows[0];
};

export const checkEmailExists = async (email) => {
  const result = await db.query(`SELECT 1 FROM "user" WHERE email = $1`, [email]);
  return result.rows.length > 0;
};

export const insertUser = async ({ username, email, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await db.query(
    `INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [username, email, passwordHash]
  );
  return result.rows[0];
};
