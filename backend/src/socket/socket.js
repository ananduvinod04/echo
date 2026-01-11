import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import Message from "../models/Message.js";

let io;

// online users: userId → socketId
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
// io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });




    // SOCKET AUTH MIDDLEWARE

io.use((socket, next) => {
  console.log(" Incoming socket connection");

  try {
    // 1️⃣ Try token from auth (Node socket test)
    let token = socket.handshake.auth?.token;

    // 2️⃣ Fallback to cookie (Browser)
    if (!token) {
      const cookies = socket.handshake.headers.cookie;
      if (cookies) {
        const parsedCookies = cookie.parse(cookies);
        token = parsedCookies.token;
      }
    }

    console.log(" Token exists:", !!token);

    if (!token) {
      console.log(" No token provided");
      return next(new Error("No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(" Token verified:", decoded);

    socket.userId = decoded.id;
    next();

  } catch (err) {
    console.log("Auth error:", err.message);
    next(new Error("Authentication failed"));
  }
});



   //  SOCKET CONNECTION
  
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.userId);

    // mark user online
    onlineUsers.set(socket.userId, socket.id);

    // broadcast online users
    io.emit("online-users", Array.from(onlineUsers.keys()));

   
     //  SEND MESSAGE
 
    socket.on("send-message", async ({ receiverId, content }) => {
      try {
        if (!receiverId || !content) return;

        const message = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          content,
        });

        // send to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", message);
        }

        // send back to sender
        socket.emit("receive-message", message);
      } catch (error) {
        console.error("Message send error:", error);
      }
    });

    //MARK MESSAGES AS SEEN
   
    socket.on("mark-seen", ({ senderId }) => {
      const senderSocketId = onlineUsers.get(senderId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("messages-seen", {
          by: socket.userId,
        });
      }
    });

    //DISCONNECT
  
    socket.on("disconnect", () => {
      console.log(" User disconnected:", socket.userId);

      onlineUsers.delete(socket.userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};




// import { Server } from "socket.io";

// export const initSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("SOCKET CONNECTED:", socket.id);

//     socket.on("disconnect", () => {
//       console.log(" SOCKET DISCONNECTED:", socket.id);
//     });
//   });
// };
