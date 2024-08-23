import { 
  addNewPost,
  getAllPosts,
  getPostByPostID,
  getPostsByUser,
  deleteByPostID,
  updatePostByID,
  filteredPosts } from "./post.repository.js";

// adding a post
export const addPost = async (req, res, next) => {
  if (req.body) {
    const { caption } = req.body;
    const { path } = req.file;
    const userId = req._id;

    if (caption || path) {
      const newPost = await addNewPost(userId, caption, path);
      console.log("mew post", newPost);
      if (newPost)
        res.status(201).send({ status: "success", post : newPost });
    }
  } else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
}

// updating a post
export const updatePost = async (req, res, next) => {
  if (req.body && req.params.postId) {

    console.log("REQ ---->>>>>", req._id);
    console.log("REQ USER ---->>>>>", req.user);
    const postId = req.params.postId;
    const  userId  = req._id;
    const { caption } = req.body;
    const { path } = req.file;

    // if(req.file.path) {
    // let path = undefined;
    // if(!req.file)
    //   path  = req.file;
    // }  

    // const updatedPost = updatePostByID(req.params.id, req.body);
    const updatedPost = await updatePostByID(postId, userId, caption, path);
    if (updatedPost) {
      res.status(200).send({ status: "success", updatedPost });
    }
  } else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
}

// getting all posts
export const allPosts = async (req, res, next) => {
  if (req) {
    const allPosts = await getAllPosts();
    if (allPosts.length > 0) {
      res.status(200).send({ status: "success", allPosts });
    } else {
      res.status(200).send({ status: "success", msg: "No posts found" });
    }
  } else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
}

// getting posts by post ID
export const getPostByID = async (req, res, next) => {
  const id = req.params.postId;
  if (id) {
    const post = await getPostByPostID(id);
    if (post) {
      res.status(200).send({ status: "success", post });
    }
  } else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
}

// getting posts by user ID
export const getPostsByUserID = async (req, res, next) => {
  if (req._id) {
    const posts = await getPostsByUser(req._id);
    if (posts.length > 0) {
      res.status(200).send({ status: "success", posts });
    } else {
      res.status(200).send({ status: "success", msg: "No posts found." });
    }
  } else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
}

//  delete a post
export const deletePost = async (req, res, next) => {
  const id = req.params.postId;
  if (id) {
    const deletedItem = await deleteByPostID(id);
    if (deletedItem) {
      res.status(200).send({ status: "success", deletedItem });
    }
  } else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
}

// searching for a post by caption. works like "contains" filter
export const filterPost = async (req, res, next) => {
  const term = req.params.term;
  console.log("term", term);
  if (term) {
    const posts = await filteredPosts(term);
    if (posts.length > 0) {
      res.status(200).send({ status: "success", posts });
    } else {
      res.status(200).send({ msg : "No posts found" });
    }
  } else {
    throw new customErrorHandler(400, 'Invalid Inputs');
  }
  next();
}