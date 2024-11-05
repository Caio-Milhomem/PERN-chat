import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { sendMessage, getMessages, getUsersForSidebar, } from "../controllers/message.controller.js";
const router = express.Router();
router.get("/conversations", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.get("/conversations", (req, res) => {
    res.send("Conversation route");
});
export default router;