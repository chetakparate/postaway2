import { getCommentsByPostId, addAComment, updateAComment, deleteAComment } from "./comment.repository.js";
import { customErrorHandler } from '../../middlewares/errorHandler.js';

// get comments for a post by post ID
export const allCommentsForPost = (req, res, next) => {

  const postId = req.params.postId;
  if (postId) {
    const postWithComments = getCommentsByPostId(postId);
    if (postWithComments.length > 0)
      res.json({ status: "success", postWithComments });
    else
      res.json({ status: "success", msg: "No comments for this post" });
  } else {
    throw new customErrorHandler(400, 'Invalid inputs or post not found');
  }
  next();
};

// adding a comment
export const addComment = async (req, res, next) => {
  const postId = req.params.postId;
  if (postId) {
    const { content } = req.body;
    const commentOnPost = await addAComment(req._id, postId, content);
    if (commentOnPost)
      res.json({ status: "success", commentOnPost });
    else {
      // const commentOnPost = addAComment(id, req.body);
      res.json({ msg: "No post found" });
    }
  }
  else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
};

// updating a comment by comment ID
export const updateComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  if (commentId) {
    const updatedComment = await updateAComment(commentId, req._id, req.body);
    if (updatedComment)
      res.json({ status: "success", updatedComment });
    else
      res.json({ msg: "Invalid inputs" });
  } else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
};

// deleting a comment by comment ID
export const deleteComment = async (req, res, next) => {
  const id = req.params.commentId;

  if (id) {
    const deletedComment = await deleteAComment(id, req._id);
    if (deletedComment)
      res.json({ status: "success", deletedComment });
    else {
      res.json({ msg: "Comment ID Not Found" });
    }
  } else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
};