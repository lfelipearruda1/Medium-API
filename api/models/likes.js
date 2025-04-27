import db from "../connect.js";

export const insertLike = async (likes_user_id, likes_post_id) => {
  await db.query(
    `INSERT INTO "likes" (likes_user_id, likes_post_id) VALUES ($1, $2)`,
    [likes_user_id, likes_post_id]
  );
};

export const deleteLike = async (likes_user_id, likes_post_id) => {
  await db.query(
    `DELETE FROM "likes" WHERE likes_user_id = $1 AND likes_post_id = $2`,
    [likes_user_id, likes_post_id]
  );
};

export const getLikesByPostId = async (likes_post_id) => {
  const { rows } = await db.query(
    `SELECT l.*, u.username, u."userImg"
     FROM "likes" AS l
     JOIN "user" AS u ON u.id = l.likes_user_id
     WHERE l.likes_post_id = $1`,
    [likes_post_id]
  );
  return rows;
};
