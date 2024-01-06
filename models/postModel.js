import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    likes: [
      {
        type: String,
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Posts = mongoose.model("Posts", postSchema);
export default Posts;
