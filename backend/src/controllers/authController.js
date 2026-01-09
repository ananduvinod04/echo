import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";  
import Otp from "../models/Otp.js";
//need to import sendEmailOtp filehere later
import sendEmailOtp from "../utils/sendEmailOtp.js";



//reguister a new user
export const registerUser = async (req, res) => {
  const { name, userId, email, password, dob } = req.body;

  if (!name || !userId || !email || !password || !dob) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.create({
    email,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    signupData: { name, userId, password, dob },
  });

  await sendEmailOtp(email, otp);

  res.json({
    success: true,
    message: "OTP sent to email",
  });
};
// varify otp and create user


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email, otp });

  if (!record) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const user = await User.create({
    ...record.signupData,
    email,
  });

  await Otp.deleteOne({ _id: record._id });

  res.status(201).json({
    success: true,
    message: "Email verified & user registered",
    userId: user._id,
  });
};

    //login user
   export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  generateToken(res, user._id);

  res.json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

//  Logout
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user).select("-password");

  res.json(user);
};

