import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

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
