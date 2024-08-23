import { PostModel } from './post.schema.js';

// create new post
export const addNewPost = async (userId, caption, path) => {
    const newPost = new PostModel({ caption, userId, imageUrl: path });
    await newPost.save();
    console.log("new post", newPost);

    return newPost;
}

// get all posts
export const getAllPosts = async (data) => {
    const result = await PostModel.find({}, { __v: 0 })
    // if (!result) {
    //     return {
    //       success: false,
    //       error: { statusCode: 404, msg: "No post found." },
    //     };
    //   } else {
    //     return { success: true, res: result };
    //   }
    return result;
};

// get post by post ID
export const getPostByPostID = async (id) => {
    const result = await PostModel.findOne({ _id: id });
    // if (!result) {
    //     return {
    //       success: false,
    //       error: { statusCode: 404, msg: "No post found." },
    //     };
    //   } else {
    //     return { success: true, res: result };
    //   }
    return result;
}

// get post by user ID
export const getPostsByUser = async (id) => {
    const userPosts = await PostModel.find({ userId: id }, { __v: 0 });
    return userPosts;
}

// delete post by post ID
export const deleteByPostID = async (id) => {
    const deletedItem = await PostModel.deleteOne({ _id: id });
    return deletedItem;
}


// update post by post ID
export const updatePostByID = async (postId, userId, caption, path) => {
    try {
        const post = await PostModel.findByIdAndUpdate(
            { _id: postId, userId: userId },
            { userId: userId, caption: caption, imageUrl: path },
            { new: true }
        );
        console.log("updated post", post);
        return post;    
    } catch (error) {
        return false;
    }
    
}

// searching for a post by caption. works like "contains" filter
export const filteredPosts = async (term) => {
    const post = await PostModel.find({ "caption": /term/i })
    console.log("filteredPosts", post);
    return post;
}