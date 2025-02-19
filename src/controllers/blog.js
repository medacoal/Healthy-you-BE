import Blog from "../models/blog.js";
import { cloudinary } from "../config/cloudinaryConfig.js";

//create property
export const createBlog = async (req, res) => {
    try {
        const {title, description} = (req.body);
        const imageFiles = req.files


        if(!title){
            return res.status(400).json({ success: false, message: "title name is required." });
        }
        if(!description){
            return res.status(400).json({ success: false, message: "description name is required." });
        }
      

        let uploadedImages = [];
        if(imageFiles && imageFiles.length > 0){
            uploadedImages = await Promise.all(
                imageFiles.map(async (file) =>{
                    try{
                        //upload each file to cloudinary
                        const imageResult = await cloudinary.uploader.upload(file.path);
                        return{
                            url: imageResult.secure_url,
                            imagePublicId: imageResult.public_id,
                        };
                    } catch(err){
                        console.error("Error uploading image to Cloudinary:", err);
                        return {
                            error: "Failed to upload image",
                        };
                    }
    
                })
            );
        }
             // Filter out any failed uploads (optional)
             uploadedImages = uploadedImages.filter(image => !image.error);

  
        // create a new property
const blog = new Blog({
    title,
    description,
    images: uploadedImages,
});

//save project
await blog.save();

        return res.json({
            success: true,
            message: "Blog created successfully",
            blog
        });
    } catch (err) {
        res.status(500).json({success: false, message: "Server Error"});
        
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json({ success: true, blogs });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.json({ success: true, blog });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, removeImages } = req.body; // Accept images to remove
        const imageFiles = req.files;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        let updatedImages = blog.images || [];

        // **Remove images from Cloudinary if requested**
        if (removeImages && Array.isArray(removeImages)) {
            updatedImages = updatedImages.filter((image) => {
                if (removeImages.includes(image.imagePublicId)) {
                    cloudinary.uploader.destroy(image.imagePublicId); // Delete from Cloudinary
                    return false; // Remove from array
                }
                return true;
            });
        }

        // **Upload new images if provided**
        if (imageFiles && imageFiles.length > 0) {
            const uploadedImages = await Promise.all(
                imageFiles.map(async (file) => {
                    try {
                        const imageResult = await cloudinary.uploader.upload(file.path);
                        return {
                            url: imageResult.secure_url,
                            imagePublicId: imageResult.public_id,
                        };
                    } catch (err) {
                        console.error("Error uploading image:", err);
                        return null;
                    }
                })
            );

            updatedImages = [...updatedImages, ...uploadedImages.filter(img => img)]; // Append new images
        }

        // **Update the blog**
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, description, images: updatedImages },
            { new: true }
        );

        res.json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Delete images from Cloudinary
        if (blog.images && blog.images.length > 0) {
            await Promise.all(
                blog.images.map(async (image) => {
                    if (image.imagePublicId) {
                        await cloudinary.uploader.destroy(image.imagePublicId);
                    }
                })
            );
        }

        await Blog.findByIdAndDelete(id);
        res.json({ success: true, message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

