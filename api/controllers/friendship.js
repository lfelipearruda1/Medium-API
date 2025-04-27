import db from "../connect.js";

export const addFriendship = (req, res) => {
    const { follower_id, followed_id } = req.body;

    db.query(
        "INSERT INTO friendship (follower_id, followed_id) VALUES ($1, $2)",
        [follower_id, followed_id],
        (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    msg: "Aconteceu algum erro no servidor, tente novamente mais tarde",
                });
            } else {
                return res.status(200).json({ msg: "Você está seguindo esse usuário agora!" });
            }
        }
    );
};

export const deleteFriendship = (req, res) => {
    const { follower_id, followed_id } = req.query;

    db.query(
        "DELETE FROM friendship WHERE follower_id = $1 AND followed_id = $2",
        [follower_id, followed_id],
        (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    msg: "Aconteceu algum erro no servidor, tente novamente mais tarde",
                });
            } else {
                return res.status(200).json({ msg: "Você não está mais seguindo esse usuário agora!" });
            }
        }
    );
};

export const getFriendship = (req, res) => {
    db.query(
        `SELECT f.*, u.username, u.userImg 
         FROM friendship AS f 
         JOIN "user" AS u ON u.id = f.followed_id 
         WHERE f.follower_id = $1`,
        [req.query.follower_id],
        (error, data) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    msg: "Aconteceu algum erro no servidor, tente novamente mais tarde",
                });
            } else if (data) {
                return res.status(200).json({ data });
            }
        }
    );
};
