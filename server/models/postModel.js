const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Uncategorized",
        "Agriculture",
        "Business",
        "Education",
        "Entertainment",
        "Art",
        "Investment",
        "Weather",
      ],
      message: "{ VALUE  is not supported}",
      default: "Uncategorized",
    },
    description: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "BlogUser",
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("BlogPost", postSchema);
