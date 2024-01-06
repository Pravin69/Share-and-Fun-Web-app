import Verification from "../models/emailVerification.js";
import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import PasswordReset from "./../models/PasswordReset.js";
import { resetPasswordLink } from "../utils/sendEmail.js";
import FriendRequest from "./../models/friendRequest.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;

  try {
    const result = await Verification.findOne({ userId });
    if (result) {
      const { expiresAt, token: hashedToken } = result;

      // token has expires
      if (expiresAt < Date.now()) {
        await Verification.findOneAndDelete({ userId });
        await Users.findOneAndDelete({ _id: userId });
        const message = "Verification token has expired!";
        res.redirect(`/users/verified?status=error&message=${message}`);
      } else {
        // token is valid
        const isMatch = await compareString(token, hashedToken);
        if (isMatch) {
          await Users.findOneAndUpdate({ _id: userId }, { verified: true });
          await Verification.findOneAndDelete({ userId });
          const message = "Email verified successfully";
          res.redirect(`/users/verified?status=success&message=${message}`);
        } else {
          // invalid token
          const message = "Verification failed or link is invalid";
          res.redirect(`/users/verified?status=error&message=${message}`);
        }
      }
    } else {
      const message = "Invalid verification link. Try again later.";
      res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error);
    res.redirect(`/users/verified?status=error&message=${error.message}`);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "Email address not found",
      });
    }

    const existingRequest = await PasswordReset.findOne({ email });
    if (existingRequest) {
      if (existingRequest.expiresAt > Date.now()) {
        return res.status(201).json({
          status: "Pending",
          message: "Reset password link has already been sent to your email!",
        });
      } else {
        await PasswordReset.findOneAndDelete({ email });
      }
    } else {
      await resetPasswordLink(user, res);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { userId, token } = req.params;

  try {
    // Find record
    const user = await Users.findById(userId);

    if (!user) {
      const message = "Invalid password reset link. Please try again!";
      res.redirect(`/users/reset-password-form?status=error&message=${message}`);
    }

    const resetPassword = await PasswordReset.findOne({ userId });

    if (!resetPassword) {
      const message = "Invalid password reset link. Try again!";
      return res.redirect(`/users/reset-password-form?status=error&message=${message}`);
    }

    const { expiresAt, token: resetToken } = resetPassword;

    if (expiresAt < Date.now()) {
      const message = "Reset Password link has expired. Please try again!";
      res.redirect(`/users/reset-password-form?status=error&message=${message}`);
    } else {
      const isMatch = await compareString(token, resetToken);

      if (!isMatch) {
        const message = "Invalid password reset link. Please try again!";
        res.redirect(`/users/reset-password-form?status=error&message=${message}`);
      } else {
        res.redirect(`/users/reset-password-form?type=reset&id=${userId}`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
    });
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const hashedPassword = await hashString(password);
    const user = await Users.findByIdAndUpdate({ _id: userId }, { password: hashedPassword });

    if (user) {
      await PasswordReset.findOneAndDelete({ userId });
      const message = "Password successfully reset 😁";
      const url = `${process.env.APP_URL}/users/reset-password-form?status=success&message=${message}`;
      res.redirect(200, url);

      // res.status(200).json({
      //   ok: true,
      // });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const user = await Users.findById(id ?? userId).populate({
      path: "friends",
      select: "-password",
    });

    if (!user) {
      return res.status(200).send({
        message: "User not Found",
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Auth error",
      success: false,
      error: error.message,
    });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, location, profileUrl, profession } = req.body;

    if (!(firstName && lastName && location && profileUrl && profession)) {
      next("Please provide all required fields!");
      return;
    }

    const { userId } = req.user;

    const updateUser = {
      firstName,
      lastName,
      location,
      profession,
      profileUrl,
      _id: userId,
    };

    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    await user.populate({ path: "friends", select: "-password" });
    const token = createJWT(user?._id);

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
    });
  }
};

export const friendRequest = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { requestTo } = req.body;

    const requestExist = await FriendRequest.findOne({
      requestFrom: userId,
      requestTo,
    });

    if (requestExist) {
      if (requestExist.requestStatus === "Pending") next("Friend request already sent! 🤷‍♂️");
      else if (requestExist.requestStatus === "Denied") next("Friend request denied! 😓");
      return;
    }

    const accountExist = await FriendRequest.findOne({
      requestFrom: requestTo,
      requestTo: userId,
    });

    if (accountExist) {
      if (requestExist.requestStatus === "Pending") next("Friend request already sent! 🤷‍♂️");
      else if (requestExist.requestStatus === "Denied") next("Friend request denied! 😓");
      return;
    }

    await FriendRequest.create({
      requestFrom: userId,
      requestTo,
    });

    res.status(201).json({
      success: true,
      message: "Friend request sent 😊",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong 😓",
      success: false,
      error: error.message,
    });
  }
};

export const getFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "Pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstName lastName profileUrl profession -password",
      })
      .limit(10)
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong 😓",
      success: false,
      error: error.message,
    });
  }
};

export const acceptFriendRequest = async (req, res, next) => {
  try {
    const { userId: id } = req.user;
    const { rid, status } = req.body;
    const requestExist = await FriendRequest.findById(rid);

    if (!requestExist) {
      next("No friend request found!");
      return;
    }

    const newRequest = await FriendRequest.findByIdAndUpdate({ _id: rid }, { requestStatus: status });

    if (status === "Accepted") {
      const user = await Users.findById(id);
      user.friends.push(newRequest?.requestFrom);
      await user.save();

      const friend = await Users.findById(newRequest?.requestFrom);
      friend.friends.push(newRequest?.requestTo);
      await friend.save();
    }

    res.status(201).json({
      success: true,
      message: "Friend request " + status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong 😓",
      success: false,
      error: error.message,
    });
  }
};

export const profileViews = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.body;

    const user = await Users.findById(id);
    user.views.push(userId);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong 😓",
      success: false,
      error: error.message,
    });
  }
};

export const suggestedFriends = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const queryObject = {};
    queryObject._id = { $ne: userId };
    queryObject.friends = { $nin: userId };

    const queryResult = Users.find(queryObject).limit(15).select("firstName lastName profileUrl profession -password");

    const suggestedFriends = await queryResult;
    res.status(200).json({
      success: true,
      data: suggestedFriends,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong 😓",
      success: false,
      error: error.message,
    });
  }
};
