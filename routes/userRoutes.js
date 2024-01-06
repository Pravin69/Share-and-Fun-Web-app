import express from "express";
import path from "path";
import {
  acceptFriendRequest,
  changePassword,
  friendRequest,
  getFriendRequest,
  getUser,
  profileViews,
  requestPasswordReset,
  resetPassword,
  suggestedFriends,
  updateUser,
  verifyEmail,
} from "../controllers/userController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

router.get("/verify/:userId/:token", verifyEmail);

// Password Reset
router.post("/request-password-reset", requestPasswordReset);
router.get("/reset-password/:userId/:token", resetPassword);
router.post("/reset-password", changePassword);

// User routes
router.get("/get-user/:id?", userAuth, getUser);
router.put("/update-user", userAuth, updateUser);

// Friend request
router.post("/friend-request", userAuth, friendRequest);
router.get("/get-friend-request", userAuth, getFriendRequest);

// Accept / deny friend request
router.post("/accept-request", userAuth, acceptFriendRequest);

// View profile
router.post("/profile-view", userAuth, profileViews);

// Suggested friends
router.get("/suggested-friends", userAuth, suggestedFriends);

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});

router.get("/reset-password-form", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});

export default router;
