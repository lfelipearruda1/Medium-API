import jwt from "jsonwebtoken";

export const checkToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ msg: "Acesso negado." });
    }

    try {
        jwt.verify(token, process.env.TOKEN);
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ msg: "Token inválido." });
    }
};
