import mongoose from "mongoose";

export const otpSchema = new mongoose.Schema({
    userId : {
        required : true,
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        unique : true
    },
    otp : {
        type : String,
        required : true
    }
});