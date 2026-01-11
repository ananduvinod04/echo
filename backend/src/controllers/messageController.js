import Message from "../models/Message.js";
import mongoose from "mongoose";

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.user;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: userId },
        { sender: userId, receiver: loggedInUserId },
      ],
    })
      .sort({ createdAt: 1 }); // oldest → newest

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const markMessagesAsSeen = async (req, res) => {
  try {
    const { userId } = req.params; // chat partner
    const loggedInUserId = req.user;

    await Message.updateMany(
      {
        sender: userId,
        receiver: loggedInUserId,
        seen: false,
      },
      { $set: { seen: true } }
    );

    res.json({ message: "Messages marked as seen" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};