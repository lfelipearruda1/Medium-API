import express from "express";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json()); 

app.use("/api/users/", userRouter);
app.use("/api/auth/", authRouter);
app.use("/api/post/", postRouter);

app.listen(8001, () => {
    console.log("Servidor rodando na porta 8001");
});
