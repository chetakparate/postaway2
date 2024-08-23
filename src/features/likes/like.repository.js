import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { PostModel } from "../posts/post.schema.js";

const LikeModel = mongoose.model('Likes', likeSchema);

// getting likes count by post ID
export const likeCounter = async (postId) => {
    const counter = await LikeModel.countDocuments({postId});
    console.log("postID, counter--->", postId, counter)
    if(counter > 0)
        return counter;
    else
        return false;
}

  // toggle like status
  export const toggleLikes = async (userId, postId) => {
    const likeDoc = await LikeModel.findOneAndDelete({userId, postId});
    if(likeDoc) {
        return false;
    }
    const likeContent = new LikeModel({userId, postId});
    await likeContent.save();
    return true;

  }