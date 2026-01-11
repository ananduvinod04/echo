import express from "express";
import { createPost,
    getPosts,
    getPostsByUser,
    updatePost,
    deletePost,
    likeUnlikePost,
    addComment} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();



router.post("/", protect, upload.single("image"), createPost);
router.get("/", protect, getPosts);
router.get("/user/:userId", protect, getPostsByUser);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, likeUnlikePost);
router.post("/:id/comment", protect, addComment);
export default router;
