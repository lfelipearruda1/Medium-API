import db from "../connect.js";

export const searchPostDb = async (params) => {
  const { rows } = await db.query(
    `SELECT p.*, u.username, u."userImg"
     FROM posts AS p
     JOIN "user" AS u ON u.id = p."userId"
     WHERE unaccent(p.post_desc) ILIKE '%' || unaccent($1) || '%'
     ORDER BY p.created_at DESC`,
    [params]
  );
  return rows;
};

export const searchUserDb = async (params) => {
  const { rows } = await db.query(
    `SELECT username, "userImg", id
     FROM "user"
     WHERE unaccent(username) ILIKE '%' || unaccent($1) || '%'`,
    [params]
  );
  return rows;
};
