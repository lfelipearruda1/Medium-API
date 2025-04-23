import db from "../connect.js";

export const addLikes = async (req, res) => {
  const { likes_user_id, likes_post_id } = req.body;

  try {
    await db.query(
      `INSERT INTO "like" (likes_user_id, likes_post_id) VALUES ($1, $2)`,
      [likes_user_id, likes_post_id]
    );

    return res.status(200).json({ msg: "Like enviado com sucesso." });
  } catch (error) {
    console.error("Erro ao inserir Like:", error);
    return res
      .status(500)
      .json({ msg: "Erro no servidor, tente novamente mais tarde." });
  }
};

export const deleteLikes = async (req, res) => {
  const { likes_user_id, likes_post_id } = req.query;

  try {
    await db.query(
      `DELETE FROM "like" WHERE likes_user_id = $1 AND likes_post_id = $2`,
      [likes_user_id, likes_post_id]
    );

    return res.status(200).json({ msg: "Like deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar Like:", error);
    return res
      .status(500)
      .json({ msg: "Erro no servidor, tente novamente mais tarde." });
  }
};

export const getLikes = async (req, res) => {
  const { likes_post_id } = req.query;

  try {
    const { rows } = await db.query(
      `SELECT l.*, u.username, u.userImg
       FROM "like" AS l
       JOIN "user" AS u ON u.id = l.likes_user_id
       WHERE l.likes_post_id = $1`,
      [likes_post_id]
    );

    return res.status(200).json({ data: rows });
  } catch (error) {
    console.error("Erro ao buscar Likes:", error);
    return res
      .status(500)
      .json({ msg: "Erro no servidor ao buscar Likes.", error: error.message });
  }
};
