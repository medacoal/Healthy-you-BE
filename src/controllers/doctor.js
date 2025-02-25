import Doctor from "../models/doctor.js";
import { cloudinary } from "../config/cloudinaryConfig.js";

export const createDoctor = async (req, res) => {
    try {
        console.log("Request received:", req.body); // Debugging log

        const { name, title, description, bio } = req.body;
        const imageFiles = req.files; // Array of images from multer

        // Check for required fields
        if (!name || !title || !description || !bio) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        let uploadedImages = [];

        // Upload images if provided
        if (imageFiles && imageFiles.length > 0) {
            uploadedImages = await Promise.all(
                imageFiles.map(async (file) => {
                    try {
                        // Upload each file to Cloudinary
                        const imageResult = await cloudinary.uploader.upload(file.path);
                        return {
                            url: imageResult.secure_url,
                            imagePublicId: imageResult.public_id,
                        };
                    } catch (err) {
                        console.error("Error uploading image to Cloudinary:", err);
                        return { error: "Failed to upload image" };
                    }
                })
            );
        }

        // Remove any failed uploads (optional)
        uploadedImages = uploadedImages.filter(image => !image.error);

        // Create a new doctor with images
        const doctor = new Doctor({
            name,
            title,
            description,
            bio,
            images: uploadedImages, // Save the uploaded images
        });

        await doctor.save();

        res.status(201).json({ success: true, message: "Doctor created successfully", doctor });
    } catch (err) {
        console.error("Create Doctor Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get All Doctors
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json({ success: true, doctors });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get Doctor by ID
export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.json({ success: true, doctor });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, title, description, bio, removeImages } = req.body; // Accept images to remove
        const imageFiles = req.files; // Array of images from multer

        console.log("Updating doctor with ID:", id);

        // Find the doctor
        let doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        let updatedImages = doctor.images || []; // Keep existing images if no new ones are provided

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
                        console.error("Error uploading image to Cloudinary:", err);
                        return null;
                    }
                })
            );

            updatedImages = [...updatedImages, ...uploadedImages.filter(img => img)]; // Append new images
        }

        // **Update the doctor**
        doctor = await Doctor.findByIdAndUpdate(
            id,
            { name, title, description, bio, images: updatedImages },
            { new: true }
        );

        res.json({ success: true, message: "Doctor updated successfully", doctor });

    } catch (error) {
        console.error("Update Doctor Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


// Delete Doctor
export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Delete image from Cloudinary if exists
        if (doctor.image && doctor.image.imagePublicId) {
            await cloudinary.uploader.destroy(doctor.image.imagePublicId);
        }

        await Doctor.findByIdAndDelete(id);
        res.json({ success: true, message: "Doctor deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
