import express from "express";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import cors from "cors";

const app = express();

app.use(express.json()); 
app.use(cors());

app.use("/api/users/", userRouter);
app.use("/api/auth/", authRouter);

app.listen(8001, ()=> {
    console.log("Servidor rodando na porta 8001");
});
