import db from "../connect.js";

export const creatComment = async (req, res) => {
  const { comment_desc, post_id, comment_user_id } = req.body;

  if (!comment_desc) {
    return res.status(422).json({ msg: "O comentário precisa ter um texto." });
  }

  try {
    await db.query(
      `INSERT INTO comments (comment_desc, post_id, comment_user_id) VALUES ($1, $2, $3)`,
      [comment_desc, post_id, comment_user_id]
    );

    return res.status(200).json({ msg: "Comentário enviado com sucesso." });
  } catch (error) {
    return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
  }
};

export const getComment = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT c.*, u.username, u."userImg"
       FROM comments AS c
       JOIN "user" AS u ON u.id = c.comment_user_id
       WHERE c.post_id = $1
       ORDER BY c.created_at DESC`,
      [req.query.post_id]
    );

    return res.status(200).json({ data: rows });
  } catch (error) {
    return res.status(500).json({ msg: "Erro interno no servidor.", error: error.message });
  }
};
