import { likeCounter, toggleLikes } from "./like.repository.js";
import { customErrorHandler } from '../../middlewares/errorHandler.js';

// getting likes count by post ID
export const likesCount = async (req, res, next) => {
  const postId = req.params.id;
  if(postId) {
      const counter = await likeCounter(postId);
      if (counter)
        res.status(200).send({ status: "success", counter });
      else
        res.status(200).send({ status: "success", msg: "No likes or post not found" });
  } else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
};

// toggle like status
export const toggleLike = async (req, res, next) => {
  const postId = req.params.id;
  if (postId) {
      const likeValue = await toggleLikes(req._id, postId);
      if(likeValue) {
      res.status(201).json({ status: "success", likeValue });
    } else {
      res.status(404).json({ status: "success", likeValue });
    }
  } else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
};