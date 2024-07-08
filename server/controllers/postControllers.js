const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");
const cloudinary = require("../cloudinary");

// =====================    CREATE A NEW POST
// POST : api/posts/
// PROTECTED
const createPost = async (req, res, next) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !category || !description) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const thumbnail = req.files?.thumbnail;

    if (!thumbnail) {
      return next(new HttpError("Thumbnail is required.", 422));
    }

    if (thumbnail.size > 2000000) {
      return next(
        new HttpError("File size too large. Must be less than 2mb.", 422)
      );
    }

    const imageResult = await cloudinary.uploader.upload(
      req.files["thumbnail"][0].path
    );
    const newPost = new Post({
      title,
      category,
      description,
      thumbnail: imageResult.secure_url,
      creator: req.user.id,
    });
    const savedPost = await newPost.save();
    if (!savedPost) {
      return next(new HttpError("Post could not be created.", 422));
    }

    const currentUser = await User.findById(req.user.id);
    currentUser.posts += 1;
    await currentUser.save();

    res.status(201).json({
      status: "success",
      newPost,
      message: `New post ${newPost.title} created.`,
    });
  } catch (error) {
    return next(new HttpError("Post creation failed.", 422));
  }
};

// =====================    GET ALL POSTS
// GET : api/posts/
// UNPROTECTED
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    if (!posts) {
      return next(new HttpError("No posts found.", 404));
    }
    res.status(200).json({
      status: "success",
      posts,
    });
  } catch (error) {
    return next(new HttpError("No posts found.", 404));
  }
};

// =====================    GET SINGLE POST
// GET : api/posts/:id
// UNPROTECTED
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new HttpError("Post not found.", 404));
    }
    res.status(200).json({
      status: "success",
      post,
    });
  } catch (error) {
    return next(new HttpError("Post not found.", 404));
  }
};

// =====================    GET POSTS BY CATEGORY
// GET : api/posts/categories/:category
// UNPROTECTED
const getCategoryPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ category: req.params.category }).sort({
      createdAt: -1,
    });
    if (!posts) {
      return next(new HttpError("No posts found.", 404));
    }
    res.status(200).json({
      status: "success",
      posts,
    });
  } catch (error) {
    return next(new HttpError("No posts found.", 404));
  }
};

// =====================    GET POSTS BY USER
// GET : api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ creator: req.params.id }).sort({
      createdAt: -1,
    });
    // console.log(posts);
    if (!posts) {
      return next(new HttpError("No posts found.", 404));
    }
    res.status(200).json({
      status: "success",
      posts,
    });
  } catch (error) {
    return next(new HttpError("No posts found.", 404));
  }
};

// =====================    EDIT POST
// PATCH : api/posts/:id
// UNPROTECTED

const editPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { title, category, description } = req.body;

    if (!title || !category || !description) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const oldPost = await Post.findById(postId);

    if (!oldPost) {
      return next(new HttpError("Post not found.", 404));
    }

    if (req.user.id !== oldPost.creator.toString()) {
      return next(
        new HttpError("You are not authorized to edit this post.", 401)
      );
    }

    let updatedPostData = { title, category, description };
    // console.log("req files: ", req.files);
    // console.log("req.files.thumbnail: ", req.files.thumbnail);
    if (req.files && req.files.thumbnail) {
      const { path } = req.files.thumbnail[0];
      // console.log("path: ", path);
      try {
        const imageResult = await cloudinary.uploader.upload(path);
        updatedPostData.thumbnail = imageResult.secure_url;
      } catch (error) {
        return next(
          new HttpError("Failed to upload image to Cloudinary.", 500)
        );
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedPostData, {
      new: true,
    });

    if (!updatedPost) {
      return next(new HttpError("Could not update post.", 404));
    }

    res.status(200).json({
      status: "success",
      updatedPost,
    });
  } catch (error) {
    console.error(error);
    return next(new HttpError("Post update failed.", 500));
  }
};
// =====================    DELETE POST
// DELETE : api/posts/:id
// UNPROTECTED
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found.", 404));
    }

    if (req.user.id !== post.creator.toString()) {
      return next(
        new HttpError("You are not authorized to delete this post.", 401)
      );
    } else {
      await Post.findByIdAndDelete(postId);
      const currentUser = await User.findById(req.user.id);
      if (!currentUser) {
        return next(new HttpError("User not found.", 404));
      }
      const userPostCount = currentUser.posts - 1;
      await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
      res.status(200).json({
        status: "success",
      });
    }
  } catch (error) {
    return next(new HttpError("Post not found.", 404));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCategoryPosts,
  getUserPosts,
  editPost,
  deletePost,
};
