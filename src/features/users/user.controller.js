import {
  userLoginRepo,
  userRegisterationRepo,
  logoutFromAllDevices,
  // updateUserAvatar,
  getUserDetails,
  getAllUserDetails,
  userUpdate,
  setLoginTokenForDevices
} from "./user.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { customErrorHandler } from "../../middlewares/errorHandler.js";

// user registration
export const userRegisteration = async (req, res, next) => {
  let { password } = req.body;
  let avatar;
  if(req.file) {
    avatar = req.file.path;
  }
  password = await bcrypt.hash(password, 12);

  const resp = await userRegisterationRepo({ ...req.body, password, avatar });
  if (resp.success) {
    res.status(201).json({
      success: true,
      msg: "user registration successful",
      res: resp.res,
    });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

// user login
export const userLogin = async (req, res, next) => {
  const resp = await userLoginRepo(req.body);
  if (resp.success) {
    const token = jwt.sign(
      { _id: resp.res._id, user: resp.res.email },
      process.env.SECRET,
      {
        expiresIn: "1h",
      }
    );
    setLoginTokenForDevices(resp.res, token);
    res
      .cookie("jwtToken", token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
      .json({ success: true, msg: "user login successful", token });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

// user log out
export const userLogout = (req, res, next) => {
  res.clearCookie("jwtToken").json({ success: true, msg: "logout successful" });
};

// user log out from all devices
export const logoutAllDevices = async (req, res, next) => {

  console.log("logoutAllDevices")
  const resp = await logoutFromAllDevices(req._id);
  if (resp.success) {
    res.clearCookie("jwtToken")
    res.json({ success: true, msg: "user logged successful from all devices" });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

// update avatar
// export const updateAvatar = async (req, res, next) => {
//   const { path } = req.file;
//   const resp = await updateUserAvatar(req._id, path);
// };

// get user details
export const userDetails = async (req, res, next) => {
  const userId = req.params.userId;
  const result = await getUserDetails(userId);
  if (result.success) {
    res.status(200).json({
      success: true,
      res: result.res,
    });
  } else {
    next(new customErrorHandler(result.error.statusCode, result.error.msg));
  }
}

// get all user details
export const allUsersDetails = async (req, res, next) => {
  const result = await getAllUserDetails();
  if (result) {
    res.status(200).json({
      success: true,
      res: result,
    });
  } else {
    next(new customErrorHandler({statusCode: 404, msg: "user not found"}));
  }
}

// update user
export const updateUser = async (req, res, next) => {
  if(req.params.userId) {
    const userId = req.params.userId;
    let avatar;
    if(req.file) {
      avatar = req.file.path;
    }

    const resp = await userUpdate(userId, req.body, avatar);
    if (resp.success) {
      res.status(201).json({
        success: true,
        msg: "user details updated successfully",
        res: resp.res,
      });
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  }
  else {
    next(new customErrorHandler(400, "invalid inputs"));
  }
}