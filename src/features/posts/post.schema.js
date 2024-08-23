import mongoose from "mongoose";

// Declare the Schema of the Post model
const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    caption:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
    }
});

//Export the model
export const PostModel = mongoose.model('Posts', postSchema);
