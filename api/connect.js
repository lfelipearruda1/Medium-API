import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const db = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "medium-api",
    password: process.env.DB_PASS || "password",
    port: process.env.DB_PORT || 5432,
});

db.connect()
    .then(() => console.log("Conectado ao banco PostgreSQL!"))
    .catch((err) => console.error("Erro ao conectar ao PostgreSQL:", err));

export default db;
