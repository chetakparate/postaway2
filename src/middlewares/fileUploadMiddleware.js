// implementing multer for file upload for posts

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  
  destination: (req, file, cb) => {
    cb(null, path.resolve("images"));
  },
  filename: (req, file, cb) => {
    const updateFileName = file.originalname;
    cb(null, updateFileName);
   
  }
});

export default multer({ storage });
