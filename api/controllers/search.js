import { searchPostDb, searchUserDb } from "../models/search.js";

export const searchPost = async (req, res) => {
  const params = req.query.params;

  if (!params) {
    return res.status(422).json({ msg: "Precisamos do parâmetro." });
  }

  try {
    const data = await searchPostDb(params);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return res.status(500).json({ msg: "Aconteceu algum erro no servidor, tente novamente mais tarde!" });
  }
};

export const searchUser = async (req, res) => {
  const params = req.query.params;

  if (!params) {
    return res.status(422).json({ msg: "Precisamos do parâmetro." });
  }

  try {
    const data = await searchUserDb(params);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ msg: "Aconteceu algum erro no servidor, tente novamente mais tarde!" });
  }
};
