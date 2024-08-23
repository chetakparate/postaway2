import mongoose from "mongoose";
import { otpSchema } from "./otp.schema.js";
import { userSchema } from "../users/user.schema.js";
import { hashPassword } from "../../utils/hashPassword.js";

const OtpModel = mongoose.model('Otp', otpSchema);
const UserModel = mongoose.model('User', userSchema);

// send an otp to user
export const saveOtp = async (userId, otp) => {
  const otpDoc = await OtpModel.findOne({ userId: userId });
  const user = await UserModel.find({ _id: userId });
  if (!otpDoc.otp && !user) {
    const otpDoc = new OtpModel({ userId, otp });
    await otpDoc.save();
    console.log("OTP, User", otpDoc, user);
    return { otpDoc, user };
  }
  else {
    console.log("existingOtp OTP, User", otpDoc, user);
    return { otpDoc, user };
  }
}

// verify the sent otp from user
export const verifyOtp = async (userId, otp) => {
  const resp = await OtpModel.findOne({ userId, otp });
  if (resp) return true;
  else return false;
}

// password reset
export const updateUserPasswordRepo = async (_id, newpassword, next) => {
  try {
    const user = await UserModel.findOne({ _id }, { name: 1, email: 1, });
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      const newHashedPassword = await hashPassword(newpassword, next);
      user.password = newHashedPassword;
      await user.save();

      await OtpModel.findOneAndDelete({ userId: _id });

      return { success: true };
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};