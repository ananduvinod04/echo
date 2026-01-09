import express from "express";
import testRoutes from "./routes/testRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

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


export default app;
