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
        "Business",
        "Education",
        "Entertainment",
        "Health",
        "Fashion",
        "Music",
        "Sports",
        "Art",
        "Inventment",
        "Science",
        "Finance",
        "Weather",
        "Lifestyle",
        "Travel",
        "Food",
        "Tech",
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
