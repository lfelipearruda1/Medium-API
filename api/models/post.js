import db from "../connect.js";

export const insertPost = async (post_desc, img, userId) => {
  await db.query(
    `INSERT INTO posts (post_desc, img, "userId", created_at) VALUES ($1, $2, $3, NOW())`,
    [post_desc, img, userId]
  );
};

export const getPostsByUserId = async (userId) => {
  const { rows } = await db.query(
    `SELECT p.*, u.username, u."userImg"
     FROM posts AS p
     JOIN "user" AS u ON u.id = p."userId"
     WHERE u.id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

export const getAllPosts = async () => {
  const { rows } = await db.query(
    `SELECT p.*, u.username, u."userImg"
     FROM posts AS p
     JOIN "user" AS u ON u.id = p."userId"
     ORDER BY created_at DESC`
  );
  return rows;
};
