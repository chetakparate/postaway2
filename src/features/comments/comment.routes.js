import express from "express";
import {
    allCommentsForPost,
    addComment,
    deleteComment,
    updateComment
} from "./comment.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";
import { logGenerator } from '../../middlewares/logger.middleware.js'

const router = express.Router();

// get all comments for a post
router.route("/:postId").get(logGenerator, auth, allCommentsForPost); // 

// add a comment to a post
router.route("/:postId").post(logGenerator, auth, addComment);

// delete a comment from a post
router.route("/:commentId").delete(logGenerator, auth, deleteComment);

// update a comment on a post
router.route("/:commentId").put(logGenerator, auth, updateComment);

export default router;