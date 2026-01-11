import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";

let io;

// online users: userId → socketId
const onlineUsers = new Map();

//NOTIFICATION EMITTER
export const emitNotification = (receiverId, notification) => {
  const receiverSocketId = onlineUsers.get(receiverId.toString());

  if (receiverSocketId && io) {
    io.to(receiverSocketId).emit("new-notification", notification);
  }
};

// INIT SOCKET

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // SOCKET AUTH MIDDLEWARE
 
  io.use((socket, next) => {
    try {
      //  token from auth (node tests / mobile)
      let token = socket.handshake.auth?.token;

      //  fallback to cookies (browser)
      if (!token) {
        const cookies = socket.handshake.headers.cookie;
        if (cookies) {
          const parsedCookies = cookie.parse(cookies);
          token = parsedCookies.token;
        }
      }

      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;

      next();
    } catch (error) {
      next(new Error("Socket authentication failed"));
    }
  });

  //     SOCKET CONNECTION
  
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.userId);

    // mark user online
    onlineUsers.set(socket.userId.toString(), socket.id);

    // broadcast online users
    io.emit("online-users", Array.from(onlineUsers.keys()));

    //SEND MESSAGE
        socket.on("send-message", async ({ receiverId, content }) => {
      try {
        if (!receiverId || !content) return;

        // save message
        const message = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          content,
        });

        // emit message to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", message);
        }

        // emit back to sender
        socket.emit("receive-message", message);

        // MESSAGE NOTIFICATION
        
        if (socket.userId.toString() !== receiverId.toString()) {
          const notification = await Notification.create({
            sender: socket.userId,
            receiver: receiverId,
            type: "message",
            referenceId: socket.userId, // conversation ref (simple)
          });

          emitNotification(receiverId, notification);
        }

      } catch (error) {
        console.error("Message send error:", error);
      }
    });

    
    //   MARK MESSAGES AS SEEN
    
    socket.on("mark-seen", ({ senderId }) => {
      const senderSocketId = onlineUsers.get(senderId?.toString());

      if (senderSocketId) {
        io.to(senderSocketId).emit("messages-seen", {
          by: socket.userId,
        });
      }
    });

    // DISCONNECT
    
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.userId);

      onlineUsers.delete(socket.userId.toString());
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

//  GET IO INSTANCE

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
