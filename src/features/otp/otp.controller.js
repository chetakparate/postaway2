import nodemailer from "nodemailer";
import otpGenerator from 'otp-generator';
import {
  saveOtp,
  verifyOtp,
  updateUserPasswordRepo
} from "./otp.repository.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";

// send an otp to user
export const send = async (req, res, next) => {
  const userId = req._id;
  // const otp = parseInt((Math.random() * 1000000));
  // const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
  const otp = otpGenerator.generate(6, {lowerCaseAlphabets : false});

  console.log("generated OTP---->", otp);
  const resp = await saveOtp(userId, otp);
  const otpRecord = resp.otpDoc;
  const userRecord = resp.user;

  console.log("otpRecord", otpRecord);
  console.log("userRecord", userRecord);

  //sending email starts
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "codingninjas2k16@gmail.com",
      pass: "slwvvlczduktvhdj",
    },
  });

  const queryString = `You requested for an OTP generation for resetting your password for Postaway 2 at ${(new Date).toString()}. \n \n`

  // Nodemailer mailOptions
  const mailOptions = {
    from: "codingninjas2k16@gmail.com",
    // to: userRecord.email, ------>>>>>>>>>>> uncomment after test
    to: 'chetak.parate2@gmail.com',
    subject: "OTP generated",
    text: queryString + `Your OTP is: ${otpRecord.otp}`
  };

  // TODO: Use Nodemailer to send confirmation email
  transporter.sendMail(mailOptions);

  //sending email ends

  if (resp.user) {
    res.status(201).json({
      success: true,
      msg: "OTP generated and sent successfully",
      res: resp.otpRecord,
    });
  } else {
    next(new customErrorHandler(400, 'Error generating and sending OTP'));

  }
}

// verify OTP
export const verify = async (req, res, next) => {
  const userId = req._id;
  const { otp } = req.body;
  const resp = await verifyOtp(userId, otp);
  if (resp) {
    res.status(201).json({
      success: true,
      msg: "OTP verified successfully"
    });
  } else {
    next(new customErrorHandler(400, 'Error verifying OTP'));
  }
}

// password reset
export const updatePassword = async (req, res, next) => {
  const { newPassword, otp } = req.body;
  console.log("newPassword, otp", newPassword, otp);
  const otpVerified = await verifyOtp(req._id, otp);
  console.log("otpVerified", otpVerified)
  if(otpVerified){
    const resp = await updateUserPasswordRepo(req._id, newPassword, next);
    if (resp.success) {
      res.status(201).json({
        success: true,
        msg: "Password updated successfully!!!"
      });
    } else {
      next(new customErrorHandler(400, 'Error resetting password'));
    }
  } else {
    next(new customErrorHandler(400, 'No record found'));
  }
};