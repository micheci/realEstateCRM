// import multer from "multer";

// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// export default upload;

import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory, not disk
const upload = multer({ storage });

export default upload;
