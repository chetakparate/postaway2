import express from "express";
import {
    allPosts,
    getPostByID,
    getPostsByUserID,
    addPost,
    deletePost,
    updatePost,
    filterPost
} from "./post.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";
import { logGenerator } from '../../middlewares/logger.middleware.js'
import upload from '../../middlewares/fileUploadMiddleware.js';

const router = express.Router();

// router.route("/all").get(logGenerator, auth, allPosts); // all users all posts
// router.route("/:postId").get(logGenerator, auth, singlePost);
// router.route("/").get(logGenerator, auth, allPostsFromUser); // all posts for logged in user

// router.route("/").post(logGenerator, auth, newPost);
// router.route("/:postId").delete(logGenerator, auth, deletePost);
// router.route("/:postId").put(logGenerator, auth, updatePost);


// route for getting all posts
router.route("/all").get(logGenerator, auth, allPosts);

// route for getting posts by post ID
router.route("/:postId").get(logGenerator, auth, getPostByID);

// route for getting post by user ID
router.route("/").get(logGenerator, auth, getPostsByUserID);

// adding a post
router.route("/").post(logGenerator, auth, upload.single("imageUrl"), addPost);

// route for deleting a post by ID
router.route("/:postId").delete(logGenerator, auth, deletePost);

// updating a post
router.route("/:postId").put(logGenerator, auth, upload.single("imageUrl"), updatePost);
// router.route("/:id").put(ulogGenerator, auth, pdatePost);

// filter post by caption
router.route("/search/:term").get(logGenerator, auth, filterPost);

export default router;
