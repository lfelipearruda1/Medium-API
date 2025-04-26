import db from "../connect.js";

export const creatPost = async (req, res) => {
    const { post_desc, img, userId } = req.body;

    if (!post_desc && !img) {
        return res.status(422).json({ msg: "O post precisa ter um texto ou uma imagem." });
    }

    try {
        await db.query(
            `INSERT INTO posts (post_desc, img, "userId", created_at) VALUES ($1, $2, $3, NOW())`,
            [post_desc, img, userId]
        );

        return res.status(200).json({ msg: "Post enviado com sucesso." });
    } catch (error) {
        console.error("Erro ao inserir post:", error);
        return res.status(500).json({ msg: "Aconteceu algum erro no servidor, tente novamente mais tarde." });
    }
};

export const getPost = async (req, res) => {
    try {
      console.log("Recebendo requisição GET /post");
  
      if (req.query.id) {
        const { rows } = await db.query(
          `SELECT p.*, u.username, u."userImg"
           FROM posts AS p
           JOIN "user" AS u ON u.id = p."userId"
           WHERE u.id = $1
           ORDER BY created_at DESC`,
          [req.query.id]
        );
  
        console.log("Posts do usuário retornados:", rows);
        return res.status(200).json({ data: rows });
      } else {
        const { rows } = await db.query(
          `SELECT p.*, u.username, u."userImg"
           FROM posts AS p
           JOIN "user" AS u ON u.id = p."userId"
           ORDER BY created_at DESC`
        );
  
        console.log("Todos os posts retornados:", rows);
        return res.status(200).json({ data: rows });
      }
  
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      return res.status(500).json({ msg: "Erro interno no servidor.", error: error.message });
    }
};
  
