import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/socket/socket.js";

// Connect DB
connectDB();

// create HTTP server
const server = http.createServer(app);

// init socket.io
initSocket(server);

const PORT = process.env.PORT || 5000;

console.log("TEST_ENV =", process.env.TEST_ENV);

// ❌ REMOVE app.listen
// ✅ USE server.listen
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
