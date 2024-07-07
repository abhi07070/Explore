const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");

// =====================    CREATE A NEW POST
// POST : api/posts/
// PROTECTED
const createrPost = async (req, res, next) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !category || !description) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const { thumbnail } = req.files;

    if (thumbnail.size > 2000000) {
      return next(
        new HttpError("File size too large. Must be less than 2mb", 422)
      );
    }

    let fileName;
    fileName = thumbnail.name;
    let splittedFilename = fileName.split(".");
    let newFileName =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];

    thumbnail.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError("Post creation failed.", 422));
        } else {
          const newPost = await Post.create({
            title,
            category,
            description,
            thumbnail: newFileName,
            creator: req.user.id,
          });
          if (!newPost) {
            return next(new HttpError("Post could not be created.", 422));
          }

          const currentUser = await User.findById(req.user.id);
          const userPostCount = currentUser.posts + 1;
          await User.findByIdAndUpdate(
            req.user.id,
            { posts: userPostCount },
            { new: true }
          );

          res.status(201).json({
            status: "success",
            newPost,
            message: `New post ${newPost.title} created.`,
          });
        }
      }
    );

    // res.status(201).json({
    //   status: "success",
    //   newPost,
    //   message: `New post ${newPost.title} created.`,
    // });
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
    let fileName;
    let newFilename;
    let updatedPost;
    const postId = req.params.id;
    let { title, category, description } = req.body;

    if (!title || !category || !description) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const oldPost = await Post.findById(postId);

    if (req.user.id !== oldPost.creator.toString()) {
      return next(
        new HttpError("You are not authorized to edit this post.", 401)
      );
    }

    if (!req.files) {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          title,
          category,
          description,
        },
        { new: true }
      );
    } else {
      if (!oldPost) {
        return next(new HttpError("Post not found.", 404));
      }

      fs.unlink(
        path.join(__dirname, "..", "uploads", oldPost.thumbnail),
        async (err) => {
          if (err) {
            return next(new HttpError(err, 404));
          }
        }
      );
      // upload file
      const { thumbnail } = req.files;

      if (thumbnail.size > 2000000) {
        return next(new HttpError("File size too large. Must be < 2MB", 422));
      }
      fileName = thumbnail.name;
      splittedFilename = fileName.split(".");
      newFilename =
        splittedFilename[0] +
        uuid() +
        "." +
        splittedFilename[splittedFilename.length - 1];
      thumbnail.mv(
        path.join(__dirname, "..", "uploads", newFilename),
        async (err) => {
          if (err) {
            return next(new HttpError(err, 404));
          }
        }
      );
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          title,
          category,
          description,
          thumbnail: newFilename,
        },
        { new: true }
      );
    }

    if (!updatedPost) {
      return next(new HttpError("Could not update post.", 404));
    }
    res.status(200).json({
      status: "success",
      updatedPost,
    });
  } catch (error) {
    return next(new HttpError("Post not found.", 404));
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
      fs.unlink(
        path.join(__dirname, "..", "uploads", post.thumbnail),
        (err) => {
          if (err) {
            return next(new HttpError(err, 404));
          }
        }
      );
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
  createrPost,
  getPosts,
  getPost,
  getCategoryPosts,
  getUserPosts,
  editPost,
  deletePost,
};
