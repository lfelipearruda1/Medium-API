import { insertFriendship, removeFriendship, getFriendshipsByFollower } from "../models/friendship.js";

export const addFriendship = async (req, res) => {
  const { follower_id, followed_id } = req.body;

  try {
    await insertFriendship(follower_id, followed_id);
    return res.status(200).json({ msg: "Você está seguindo esse usuário agora!" });
  } catch (error) {
    console.error("Erro ao adicionar amizade:", error);
    return res.status(500).json({ msg: "Aconteceu algum erro no servidor, tente novamente mais tarde" });
  }
};

export const deleteFriendship = async (req, res) => {
  const { follower_id, followed_id } = req.query;

  try {
    await removeFriendship(follower_id, followed_id);
    return res.status(200).json({ msg: "Você não está mais seguindo esse usuário!" });
  } catch (error) {
    console.error("Erro ao deletar amizade:", error);
    return res.status(500).json({ msg: "Aconteceu algum erro no servidor, tente novamente mais tarde" });
  }
};

export const getFriendship = async (req, res) => {
  try {
    const friendships = await getFriendshipsByFollower(req.query.follower_id);
    return res.status(200).json({ data: friendships });
  } catch (error) {
    console.error("Erro ao buscar amizades:", error);
    return res.status(500).json({ msg: "Aconteceu algum erro no servidor, tente novamente mais tarde" });
  }
};
