import { User } from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";

export const signup = async (req, res) => {
  //   console.log("signup func");
  const { firstName, lastName, email, password } = req.body;
  //   console.log(firstName, lastName, email, password);
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedpassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedpassword,
    });
    await newUser.save();
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.log("error in signup", error);
  }
};

export const login = async (req, res) => {
  //   console.log("login func");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // jwt code
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "1d",
    });
    const cookieoptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };
    res.cookie("jwt", token, cookieoptions);
    return res
      .status(200)
      .json({ message: "User logged in successfully", user, token });
  } catch (error) {
    console.log("error in login", error);
  }
};

export const logout = (req, res) => {
  //   console.log("logout func");
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("error in logout", error);
  }
};
