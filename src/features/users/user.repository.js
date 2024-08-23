import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import {
  compareHashedPassword,
  hashPassword,
} from "../../utils/hashPassword.js";

const UserModel = mongoose.model("Users", userSchema);

// user registration
export const userRegisterationRepo = async (userData) => {
  try {
    const newUser = new UserModel(userData);
    await newUser.save();
    return { success: true, res: newUser };
  } catch (error) {
    // throw new Error("email duplicate");
    return { success: false, error: { statusCode: 400, msg: error } };
  }
};

// user login
export const userLoginRepo = async (userData) => {
  try {
    const { email, password } = userData;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      let passwordValidation = await compareHashedPassword(
        password,
        user.password
      );
      if (passwordValidation) {
        return { success: true, res: user };
      } else {
        return {
          success: false,
          error: { statusCode: 400, msg: "invalid credentials" },
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};

//  store login token for device logins
export const setLoginTokenForDevices = async (user, token) => {
  user.loginToken = token;
  await user.save();
};

// update user password
export const updateUserPasswordRepo = async (_id, newpassword, next) => {
  try {
    const user = await UserModel.findOne({ _id });
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      const newHashedPassword = await hashPassword(newpassword, next);
      user.password = newHashedPassword;
      let updatedUser = await user.save();
      return { success: true, res: updatedUser };
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};

// log out from all devices, empty login token array
export const logoutFromAllDevices = async (userId) => {
  try {
    const user = await UserModel.findOne({ _id : userId });
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      // let logoutValidation = await UserModel.updateOne({ _id : user._id}, { $pullAll : {loginToken} })
      ////////-->>>>correction to above line required
      user.loginToken = [];
      const loggedOut = await user.save();

      if (loggedOut) {
        return { success: true, res: loggedOut };
      } else {
        return {
          success: false,
          error: { statusCode: 400, msg: "invalid credentials" },
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};


// export const updateUserAvatar = async (userId, filePath) => {
//   const user = await UserModel.findOne({ userId });
//   user.avatar = filePath;
//   await user.save();
//   return user;
// }

//  get user details
export const getUserDetails = async (userId) => {
  const user = await UserModel
  .findOne({ _id : userId }, { name : 1 , email : 1, gender : 1, mobile : 1, age : 1, avatar : 1 });
  if (!user) {
    return {
      success: false,
      error: { statusCode: 404, msg: "user not found" },
    };
  } else {
      return { success: true, res: user };
  }
}

// get all user details
export const getAllUserDetails = async(userId) => {
  const result = UserModel.find({}, { _id : 0 , name : 1 , email : 1, gender : 1, mobile : 1, age : 1, avatar : 1 });
  return result;
}

// user update
export const userUpdate = async (userId, userData, avatarPath) => {
  console.log("userUpdate inputs", userId, userData);

  const user = await UserModel.findByIdAndUpdate(
    { 
      _id : userId
    }, 
    { 
      name : userData.name,
      email : userData.email,
      gender : userData.gender,
      mobile : userData.mobile,
      age : userData.age,
      avatar : avatarPath
    },
    {
      new : true,
      projection : 
      {
        _id : 0, name : 1 , email : 1, gender : 1, mobile : 1, age : 1, avatar : 1 
      }
    });

  if (!user) {
    return {
      success: false,
      error: { statusCode: 404, msg: "user not found" },
    };
  } else {
    return { success: true, res: user };
  }
}