import { insertLike, deleteLike, getLikesByPostId } from "../models/likes.js";

export const addLikes = async (req, res) => {
  const { likes_user_id, likes_post_id } = req.body;

  if (!likes_user_id || !likes_post_id) {
    return res.status(400).json({ msg: "likes_user_id e likes_post_id são obrigatórios!" });
  }

  try {
    await insertLike(likes_user_id, likes_post_id);
    return res.status(200).json({ msg: "Like enviado com sucesso." });
  } catch (error) {
    console.error("Erro ao inserir Like:", error);

    if (error.code === "23505") {
      return res.status(409).json({ msg: "Você já curtiu este post." });
    }

    return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
  }
};

export const deleteLikes = async (req, res) => {
  const { likes_user_id, likes_post_id } = req.query;

  if (!likes_user_id || !likes_post_id) {
    return res.status(400).json({ msg: "likes_user_id e likes_post_id são obrigatórios!" });
  }

  try {
    await deleteLike(likes_user_id, likes_post_id);
    return res.status(200).json({ msg: "Like deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar Like:", error);
    return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
  }
};

export const getLikes = async (req, res) => {
  const { likes_post_id } = req.query;

  if (!likes_post_id) {
    return res.status(400).json({ msg: "likes_post_id é obrigatório!" });
  }

  try {
    const likes = await getLikesByPostId(likes_post_id);
    return res.status(200).json({ data: likes });
  } catch (error) {
    console.error("Erro ao buscar Likes:", error);
    return res.status(500).json({ msg: "Erro no servidor ao buscar Likes." });
  }
};
