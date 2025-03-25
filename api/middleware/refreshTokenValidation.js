import jwt from "jsonwebtoken";

export const checkRefreshToken = (req, res, next) => {
  const refresh = req.cookies.refreshToken;

  if (!refresh) {
    return res.status(401).json({ msg: "Token de atualização ausente" });
  }

  try {
    jwt.verify(refresh, process.env.REFRESH);
    next();
  } catch (error) {
    return res.status(403).json({ msg: "Token de atualização inválido ou expirado" });
  }
};
