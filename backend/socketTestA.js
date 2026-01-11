import { io } from "socket.io-client";

// 🔐 User A token
const TOKEN_A = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjFlZjEzYzNkMWVlYWQzM2VmYWQ4NCIsImlhdCI6MTc2ODEyMDg3NiwiZXhwIjoxNzY4NzI1Njc2fQ.L9gfRunyWlYAWp2NpxpAN04_RaCK4quS12VMq7NG-A0";


// 👤 User B id
const USER_B_ID = "69635fcc4f6d9ee75a674512";

const socketA = io("http://127.0.0.1:5000", {
  transports: ["websocket"],
  auth: {
    token: TOKEN_A,
  },
});

socketA.on("connect", () => {
  console.log("🟢 User A connected:", socketA.id);

  // 🔥 SEND MESSAGE A → B
  socketA.emit("send-message", {
    receiverId: USER_B_ID,
    content: "Hi its a",
  });
});

// 📩 RECEIVE MESSAGE (B → A)
socketA.on("receive-message", (msg) => {
  console.log("📩 User A received:", msg);
});

// 👁️ Seen status
socketA.on("messages-seen", (data) => {
  console.log("👁️ User A sees messages read by:", data.by);
});

// 🟢 Online users
socketA.on("online-users", (users) => {
  console.log("🟢 Online users (A sees):", users);
});

socketA.on("connect_error", (err) => {
  console.error("❌ User A socket error:", err.message);
});
