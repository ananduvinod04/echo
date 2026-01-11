import { io } from "socket.io-client";

// 🔐 User B token
const TOKEN_B = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjM1ZmNjNGY2ZDllZTc1YTY3NDUxMiIsImlhdCI6MTc2ODEyMTAxOCwiZXhwIjoxNzY4NzI1ODE4fQ.j_7nED6BYrSp9xrkKZ2WzoE4xiPsiLUwGbnVCMzmUXg";

// 👤 User A id
const USER_A_ID = "6961ef13c3d1eead33efad84";

const socketB = io("http://127.0.0.1:5000", {
  transports: ["websocket"],
  auth: {
    token: TOKEN_B,
  },
});

socketB.on("connect", () => {
  console.log("🟢 User B connected:", socketB.id);

  // 🔥 SEND MESSAGE B → A
  socketB.emit("send-message", {
    receiverId: USER_A_ID,
    content: "Hello its b",
  });
});

// 📩 RECEIVE MESSAGE (A → B)
socketB.on("receive-message", (msg) => {
  console.log("📩 User B received:", msg);

  // mark seen (optional)
  socketB.emit("mark-seen", {
    senderId: USER_A_ID,
  });
});

// 🟢 Online users
socketB.on("online-users", (users) => {
  console.log("🟢 Online users (B sees):", users);
});

socketB.on("connect_error", (err) => {
  console.error("❌ User B socket error:", err.message);
});
