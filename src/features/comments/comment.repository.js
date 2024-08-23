import mongoose from "mongoose";
import { commentSchema } from "./comment.schema.js"; 

const CommentModel = mongoose.model('Comments', commentSchema);

// get comments for a post by post ID
export const getCommentsByPostId = async (postId) => {
    const allComments = await CommentModel.find({ postId : postId});
    return allComments;
  };

  // adding a comment
  export const addAComment = async(userId, postId, content) => {
    const commentData = new CommentModel({userId, postId, content});
    await commentData.save();
    return commentData;
  }
  
  // updating a comment by comment ID
  export const updateAComment = async (commentId, userId, data) => {
    const commentData = await CommentModel.findById(commentId);
    if(commentData.userId != userId) {
      return false;
    }
    commentData.content = data.content;
    await commentData.save();
    return commentData;
  }
  
  // deleting a comment by comment ID
  export const deleteAComment = async (id, userId) => {
    const commentData = await CommentModel.findOneAndDelete({ _id : id, userId : userId});
    if(!commentData) {
      return false;
    }
    return commentData;
  }
  