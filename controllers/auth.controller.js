import { User } from "../models/user.model.js";
import "dotenv/config";
import bcryptjs from "bcryptjs";
import { generateVerificationToken } from "./../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import AdminCode from "../models/admincode.model.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      res.send("All Fields Required");
    }

    const userAlreadyExist = await User.findOne({ email });

    //Check If User Exists
    if (userAlreadyExist) {
      res.status(400).json({ success: false, message: "User Already Exists" });
    }

    //Hash Password Using Bcrypt
    const hashedPassword = await bcryptjs.hash(password, 10);

    //Generate Verification Code
    const verificationToken = generateVerificationToken();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 Hours
    });
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      message:
        "User Created Successfully. Please Check Your Email To Verify Your Account.",
    });
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, code, loginAsAdmin } = req.body;
    const user = await User.findOne({ email });

    let adminCode;
    if (loginAsAdmin) {
      adminCode = await AdminCode.findOne({ code });
      if (!adminCode || adminCode.expiresAt < new Date()) {
        res
          .status(400)
          .json({ success: false, message: "Admin Code Does Not Exist" });
      }
    }

    if (!user.isVerified) {
      res.status(400).json({
        success: false,
        message: "This User Cant Login. User should Verify",
      });
    }

    if (loginAsAdmin && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }
    const matched = await bcryptjs.compare(password, user.password);
    if (!matched) {
      res
        .status(400)
        .json({ success: false, message: "Incorrect Password Try Again" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Logged In Succesfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log({
      success: false,
      message: "Email not verified. Kindly Verify Email",
      error,
    });
    throw error;
  }
};

//Logut Route
export const logout = async (req, res) => {
  res.send("Logout Route");
};

//Verify Email
export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    if (
      user.verificationToken !== code ||
      user.verificationTokenExpiresAt < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Mark verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // generate token
    generateTokenAndSetCookie(res, user._id);

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log("Error verifying email:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
