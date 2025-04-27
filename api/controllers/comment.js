import { createCommentDb, getCommentsByPostId } from "../models/comment.js";

export const createComment = async (req, res) => {
  const { comment_desc, post_id, comment_user_id } = req.body;

  if (!comment_desc) {
    return res.status(422).json({ msg: "O comentário precisa ter um texto." });
  }

  try {
    await createCommentDb(comment_desc, post_id, comment_user_id);
    return res.status(200).json({ msg: "Comentário enviado com sucesso." });
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await getCommentsByPostId(req.query.post_id);
    return res.status(200).json({ data: comments });
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
};
