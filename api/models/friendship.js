import db from "../connect.js";

export const insertFriendship = async (follower_id, followed_id) => {
  await db.query(
    `INSERT INTO friendship (follower_id, followed_id) VALUES ($1, $2)`,
    [follower_id, followed_id]
  );
};

export const removeFriendship = async (follower_id, followed_id) => {
  await db.query(
    `DELETE FROM friendship WHERE follower_id = $1 AND followed_id = $2`,
    [follower_id, followed_id]
  );
};

export const getFriendshipsByFollower = async (follower_id) => {
  const { rows } = await db.query(
    `SELECT f.id, f.follower_id, f.followed_id, u.username, u."userImg"
     FROM friendship AS f
     JOIN "user" AS u ON u.id = f.followed_id
     WHERE f.follower_id = $1`,
    [follower_id]
  );
  return rows;
};
