import express from "express";
import { createPost, getPost } from "../controllers/post.js"; 
import { checkToken } from "../middleware/tokenValidation.js";

const router = express.Router();

router.post("/", checkToken, createPost);
router.get("/", checkToken, getPost);

export default router;
