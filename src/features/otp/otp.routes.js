import express from "express";
import { auth } from "../../middlewares/jwtAuth.js";
import { logGenerator } from '../../middlewares/logger.middleware.js'
import {
    send,
    verify,
    updatePassword
} from  './otp.controller.js'

const router = express.Router();

// send an otp to user
router.route("/send").post(logGenerator, auth, send); // 

// verify the sent otp from user
router.route("/verify").post(logGenerator, auth, verify);

// reset password route
router.route("/reset-password").post(logGenerator, auth, updatePassword);

export default router;
 