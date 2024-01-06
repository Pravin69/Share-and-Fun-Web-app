import { sendVerificationEmail } from "../utils/sendEmail.js";
import Users from "./../models/userModel.js";
import { compareString, createJWT, hashString } from "./../utils/index.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate Fields
  if (!(firstName && lastName && email && password)) {
    next("Please provide required fields!");
    return;
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Email already exists!");
      return;
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    sendVerificationEmail(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!(email && password)) {
      next("Please provide user credentials!");
      return;
    }

    // Find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });

    if (!user) {
      next("Invalid email or password");
      return;
    }

    if (!user?.verified) {
      next("User email is not verified. Check your email account to verify 😓");
      return;
    }

    // compare string
    const isMatch = await compareString(password, user?.password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    user.password = undefined;

    const token = createJWT(user?._id);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
