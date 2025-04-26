import db from "../connect.js";

export const findUserById = async (id) => {
  const query = 'SELECT username, "userImg", "bgImg" FROM "user" WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};
