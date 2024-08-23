import express from "express";
import { auth } from "../../middlewares/jwtAuth.js";
import { logGenerator } from '../../middlewares/logger.middleware.js'
import {
    friendList,
    requests,
    toggleFriend,
    friendshipResponse
} from './friendship.controller.js';

const router = express.Router();

// get friends list
router.route("/get-friends/:userId").get(logGenerator, auth, friendList); 

// get pending friend requests
router.route("/get-pending-requests").get(logGenerator, auth, requests);

// toggle friendship
router.route("/toggle-friendship/:friendId").post(logGenerator, auth, toggleFriend);

// respond to friendship request
router.route("/response-to-request/:friendId").post(logGenerator, auth, friendshipResponse);

export default router;