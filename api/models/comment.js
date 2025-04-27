import db from "../connect.js";

export const createCommentDb = async (comment_desc, post_id, comment_user_id) => {
  await db.query(
    `INSERT INTO comments (comment_desc, post_id, comment_user_id) VALUES ($1, $2, $3)`,
    [comment_desc, post_id, comment_user_id]
  );
};

export const getCommentsByPostId = async (post_id) => {
  const { rows } = await db.query(
    `SELECT c.*, u.username, u."userImg"
     FROM comments AS c
     JOIN "user" AS u ON u.id = c.comment_user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at DESC`,
    [post_id]
  );
  return rows;
};
