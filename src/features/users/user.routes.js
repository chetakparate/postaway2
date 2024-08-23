import express from "express";
import {
  // updateUserPassword,
  userLogin,
  userLogout,
  userRegisteration,
  logoutAllDevices,
  // updateAvatar,
  userDetails,
  allUsersDetails,
  updateUser
} from "./user.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";
import { logGenerator } from '../../middlewares/logger.middleware.js'
import upload from "../../middlewares/fileUploadMiddleware.js";

const router = express.Router();

// Authentication Routes
router.route("/signup").post(logGenerator, upload.single('file'), userRegisteration);
router.route("/signin").post(logGenerator, userLogin);

// logout routes
router.route("/logout").get(logGenerator, userLogout);
router.route("/logout-all-devices").get(logGenerator, auth, logoutAllDevices);

// User Profile Updates Routes
router.route("/get-details/:userId").get(logGenerator, auth, userDetails); 
router.route("/get-all-details").get(logGenerator, auth, allUsersDetails); 
router.route("/update-details/:userId").post(logGenerator, auth, upload.single('file'), updateUser);
// router.route("/update/avatar").post(logGenerator, auth, updateAvatar); 

export default router;
