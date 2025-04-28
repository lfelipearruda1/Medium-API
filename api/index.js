import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import searchRouter from "./routes/search.js";
import likesRouter from "./routes/likes.js";
import friendshipRouter from "./routes/friendship.js";
import commentRouter from "./routes/comment.js";
import uploadRouter from "./routes/upload.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/search", searchRouter);
app.use("/api/likes", likesRouter);
app.use("/api/friendship", friendshipRouter);
app.use("/api/comment", commentRouter);
app.use("/api/upload", uploadRouter);

app.listen(8001, () => {
  console.log("Servidor rodando na porta 8001");
});
