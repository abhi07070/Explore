const User = require("../models/userModel");
const HttpError = require("../models/errorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

// ===================== REGISTER A NEW USER
// POST : api/users/register
// UNPROTECTED
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;

    if (!name || !email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const newEmail = email.toLowerCase();

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists.", 422));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError("Password must be at least 6 characters.", 422)
      );
    }

    if (password !== password2) {
      return next(new HttpError("Passwords do not match.", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "success",
      newUser,
      message: `New user ${newUser.email} registered.`,
    });
  } catch (error) {
    return next(new HttpError("User registration failed.", 422));
  }
};

// ===================== LOGIN USER
// POST : api/users/login
// UNPROTECTED
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("User not found.", 422));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new HttpError("Incorrect password.", 422));
    }

    const { _id: id, name } = user;

    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      id,
      token,
      name,
      message: `${user.name} logged in.`,
    });
  } catch (error) {
    return next(
      new HttpError("User login failed. Please check your credentials.", 422)
    );
  }
};

// ===================== USER PROFILE
// POST : api/users/:id
// PROTECTED
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    return next(new HttpError("User profile fetch failed.", 422));
  }
};

// ===================== CHANGE USER AVATAR (profile picture)
// POST : api/users/change-avatar
// PROTECTED
const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("Please upload an image.", 422));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError("User avatar change failed.", 422));
        }
      });
    }

    const { avatar } = req.files;
    if (avatar.size > 500000) {
      return next(
        new HttpError("File size too large. Must be less than 500kb", 422)
      );
    }

    let fileName;
    fileName = avatar.name;
    let splittedFilename = fileName.split(".");
    let newFileName =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];

    avatar.mv(path.join(__dirname, "..", "uploads", newFileName), (err) => {
      if (err) {
        return next(new HttpError("User avatar change failed.", 422));
      }
      user.avatar = newFileName;
      user.save();
      res.status(200).json({
        status: "success",
        user,
      });
    });
  } catch (error) {
    return next(new HttpError("User avatar change failed.", 422));
  }
};

// ===================== EDIT USER DETAILS (from profile)
// POST : api/users/edit-user
// PROTECTED
const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    if (
      !name ||
      !email ||
      !currentPassword ||
      !newPassword ||
      !confirmNewPassword
    ) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    const emailExist = await User.findOne({ email });
    if (emailExist && emailExist._id !== req.user.id) {
      return next(new HttpError("Email already in use.", 422));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new HttpError("Incorrect password.", 422));
    }

    if (newPassword !== confirmNewPassword) {
      return next(new HttpError("Passwords do not match.", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        password: hashedPassword,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      updatedUser,
    });
  } catch (error) {
    return next(new HttpError("User edit failed.", 422));
  }
};

// ===================== GET AUTHORS
// POST : api/users/authors
// PROTECTED
const getAuthors = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    return next(new HttpError("Authors fetch failed.", 422));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
