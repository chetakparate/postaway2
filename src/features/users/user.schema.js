import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: [3, "The name should be at least 3 characters long"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/],
  },
  password: { 
    type: String,
    required: [true, "password is required"] ,
  },
  gender : {
    type : String,
    required : true,
    enum : ['Male', 'Female']
  },
  mobile: {
    type: String,
    unique: true
  },
  age: {
    type: Number,
    // required: [true, "age is required"],
    validate: {
      validator: function (userAge) {
        return userAge > 0 && userAge <= 100;
      },
      message: "age must be b/w 0 and 100",
    }},
    loginToken : [
      {
        type : String,
      }
    ],
  avatar : {
    type : String
  },
  friends: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  pendingRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});
