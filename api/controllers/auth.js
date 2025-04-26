import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByEmail, checkEmailExists, insertUser } from "../models/auth.js";

export const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username) return res.status(422).json({ msg: "O nome é obrigatório!" });
  if (!email) return res.status(422).json({ msg: "O email é obrigatório!" });
  if (!password) return res.status(422).json({ msg: "A senha é obrigatória!" });
  if (password !== confirmPassword) return res.status(422).json({ msg: "As senhas não são iguais!" });

  try {
    if (await checkEmailExists(email)) {
      return res.status(409).json({ msg: "Este email já está sendo usado." });
    }

    const newUser = await insertUser({ username, email, password });
    return res.status(201).json({ msg: "Cadastro efetuado com sucesso!", user: newUser });

  } catch (error) {
    console.error("Erro no cadastro:", error);
    return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ msg: "Usuário não encontrado!" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(422).json({ msg: "Senha incorreta!" });

    const accessToken = jwt.sign({ id: user.id }, process.env.TOKEN, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH, { expiresIn: "1d" });

    delete user.password;

    return res
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .status(200)
      .json({ msg: "Usuário logado com sucesso!", user });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", { secure: true, sameSite: "none" })
    .clearCookie("refreshToken", { secure: true, sameSite: "none" })
    .status(200)
    .json({ msg: "Logout efetuado com sucesso." });
};

export const refresh = (req, res) => {
  const refresh = req.cookies.refreshToken;

  if (!refresh) {
    return res.status(401).json({ msg: "Acesso negado." });
  }

  try {
    const decoded = jwt.verify(refresh, process.env.REFRESH);

    const newAccessToken = jwt.sign({ id: decoded.id }, process.env.TOKEN, { expiresIn: "1h" });
    const newRefreshToken = jwt.sign({ id: decoded.id }, process.env.REFRESH, { expiresIn: "1d" });

    return res
      .cookie("accessToken", newAccessToken, { httpOnly: true })
      .cookie("refreshToken", newRefreshToken, { httpOnly: true })
      .status(200)
      .json({ msg: "Token atualizado com sucesso!" });

  } catch (err) {
    console.error("Erro ao atualizar token:", err);
    return res.status(403).json({ msg: "Token Inválido." });
  }
};
