import { findUserById } from "../models/user.js";

export const getUser = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(422).json({ msg: "Precisamos do id do usuário." });
  }

  try {
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ msg: "Aconteceu algum erro no servidor, tente novamente mais tarde." });
  }
};
