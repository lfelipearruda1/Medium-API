import { insertPost, getPostsByUserId, getAllPosts } from "../models/post.js";

export const createPost = async (req, res) => {
  const { post_desc, img, userId } = req.body;

  if (!post_desc && !img) {
    return res.status(422).json({ msg: "O post precisa ter um texto ou uma imagem." });
  }

  try {
    await insertPost(post_desc, img, userId);
    return res.status(200).json({ msg: "Post enviado com sucesso." });
  } catch (error) {
    console.error("Erro ao inserir post:", error);
    return res.status(500).json({ msg: "Aconteceu algum erro no servidor, tente novamente mais tarde." });
  }
};

export const getPost = async (req, res) => {
  try {
    if (req.query.id) {
      const posts = await getPostsByUserId(req.query.id);
      return res.status(200).json({ data: posts });
    } else {
      const posts = await getAllPosts();
      return res.status(200).json({ data: posts });
    }
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
};
