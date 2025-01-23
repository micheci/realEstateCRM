import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory (not local disk)

const upload = multer({ storage: storage }).array("images[]"); // This allows multiple image uploads

export default upload;
