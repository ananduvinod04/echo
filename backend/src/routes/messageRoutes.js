import express from "express";
import { getMessages ,
    markMessagesAsSeen,

} from "../controllers/messageController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:userId", protect, getMessages);
router.put("/:userId/seen", protect, markMessagesAsSeen);

export default router;
