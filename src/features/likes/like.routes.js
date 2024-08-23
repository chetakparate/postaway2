import express from "express";
import { auth } from "../../middlewares/jwtAuth.js";
import { logGenerator } from "../../middlewares/logger.middleware.js";
import { likesCount, toggleLike } from './like.controller.js';

const router = new express.Router();

// getting likes count by post ID
router.route('/:id').get(logGenerator, auth, likesCount);

// toggle like status
router.route('/toggle/:id').post(logGenerator, auth, toggleLike);

export default router;