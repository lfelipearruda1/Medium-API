import db from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username)
        return res.status(422).json({ msg: "O nome é obrigatório!" });

    if (!email)
        return res.status(422).json({ msg: "O email é obrigatório!" });

    if (!password)
        return res.status(422).json({ msg: "A senha é obrigatória!" });

    if (password !== confirmPassword)
        return res.status(422).json({ msg: "As senhas não são iguais!" });

    try {
        const userExists = await db.query(
            `SELECT email FROM "user" WHERE email = $1`,
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(409).json({ msg: "Este email já está sendo usado." });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await db.query(
            `INSERT INTO "user" (username, email, password)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [username, email, passwordHash]
        );

        return res.status(201).json({
            msg: "Cadastro efetuado com sucesso!",
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error("Erro no cadastro:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query(
            `SELECT * FROM "user" WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        const user = result.rows[0];
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha incorreta!" });
        }

        const refreshToken = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                id: user.password,
            },
            process.env.REFRESH,
            { algorithm: "HS256" }
        );

        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 3600,
                id: user.password,
            },
            process.env.TOKEN,
            { algorithm: "HS256" }
        );

        delete user.password;

        return res
            .cookie("accessToken", token, {
                httpOnly: true,
                sameSite: "lax",
                path: "/"
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                path: "/"
            })
            .status(200)
            .json({
                msg: "Usuário logado com sucesso!",
                user,
            });

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};

export const logout = (req, res) => {
    return res
        .clearCookie("accessToken", { sameSite: "lax", path: "/" })
        .clearCookie("refreshToken", { sameSite: "lax", path: "/" })
        .status(200)
        .json({ msg: "Logout efetuado com sucesso." });
};

export const refresh = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ msg: "Token inválido ou ausente!" });
        }

        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.REFRESH);
        } catch (error) {
            return res.status(403).json({ msg: "Token inválido ou expirado!" });
        }

        const newRefreshToken = jwt.sign(
            { id: payload.id },
            process.env.REFRESH,
            { expiresIn: "1d" }
        );

        const newAccessToken = jwt.sign(
            { id: payload.id },
            process.env.TOKEN,
            { expiresIn: "1h" }
        );

        return res
            .cookie("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "lax",
                path: "/"
            })
            .cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                sameSite: "lax",
                path: "/"
            })
            .status(200)
            .json({ msg: "Token atualizado com sucesso!" });

    } catch (error) {
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};
