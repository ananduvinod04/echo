import express from "express";
import testRoutes from "./routes/testRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";


const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send(" ECHO Backend Running");
});
app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);


export default app;
