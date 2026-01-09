import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  signupData: {
    name: String,
    userId: String,
    password: String,
    dob: Date,
  },
});

export default mongoose.model("Otp", otpSchema);
