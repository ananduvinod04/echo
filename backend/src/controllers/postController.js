import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";
import Notification from "../models/Notification.js";
import { emitNotification } from "../socket/socket.js";



//create a post
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = "";

    if (req.file) {
      // convert buffer → base64
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(base64Image, {
        folder: "echo_posts",
        resource_type: "image",
      });

      imageUrl = uploadResult.secure_url;
    }

    const post = await Post.create({
      author: req.user,
      text,
      imageUrl,
    });

    res.status(201).json(post);

  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};


//get all posts


export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name userId")
      .populate("comments.user", "name userId")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//update a post
export const updatePost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.text = text || post.text;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete a post

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//like unlike a post
export const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.includes(req.user);

    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user.toString()
      );
    } else {
      post.likes.push(req.user);
    }

    await post.save();
    res.json(post);
    // send notification ONLY when liking (not unliking)
if (!isLiked && post.author.toString() !== req.user.toString()) {
  const notification = await Notification.create({
    sender: req.user,
    receiver: post.author,
    type: "like",
    referenceId: post._id,
  });

  emitNotification(post.author, notification);
}
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//comment on a post
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: req.user,
      text,
    });

    await post.save();

    res.json(post);
// send notification

    if (post.author.toString() !== req.user.toString()) {
  const notification = await Notification.create({
    sender: req.user,
    receiver: post.author,
    type: "comment",
    referenceId: post._id,
  });

  emitNotification(post.author, notification);
}
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get posts by a user
export const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const posts = await Post.find({ author: userId })
      .populate("author", "name userId")
      .populate("comments.user", "name userId")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};