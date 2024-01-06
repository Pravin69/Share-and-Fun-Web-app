import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requestTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    requestFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    requestStatus: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const FriendRequest = mongoose.model("FriendRequest", requestSchema);
export default FriendRequest;
