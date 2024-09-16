import express from "express";
import authRoutes from "./routes/auth.route.js";
import messagesRoutes from "./routes/messages.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
