import express from "express"
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from "../controllers/blog.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post('/create', createBlog)
router.get('/all', getAllBlogs)
router.get('/:id', getBlogById)
router.put('/update/:id',upload.array('images',2), updateBlog)
router.delete('/delete/:id', deleteBlog)

export default router;