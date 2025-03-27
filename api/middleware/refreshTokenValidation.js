import jwt from "jsonwebtoken";

export const checkRefreshToken = (req, res, next) => {
  const refresh = req.cookies.refreshToken;

  if (!refresh) {
    return res.status(401).json({ msg: "Acesso negado." });
  }

  try {
    const decoded = jwt.verify(refresh, process.env.REFRESH);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erro na verificação do refresh token:", error);
    return res.status(403).json({ msg: "Token Inválido." });
  }
};
