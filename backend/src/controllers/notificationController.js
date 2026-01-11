import Notification from "../models/Notification.js";


//   GET USER NOTIFICATIONS

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user,
    })
      .populate("sender", "name userId")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  // MARK SINGLE AS READ

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      receiver: req.user,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//   MARK ALL AS READ

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { receiver: req.user, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
