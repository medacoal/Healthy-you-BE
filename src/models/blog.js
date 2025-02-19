import mongoose from 'mongoose';
const { Schema } = mongoose;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            url: {
                type: String,
                required: true,  // Ensure every image has a URL
            },
            imagePublicId: {
                type: String,
                required: true,  // Ensure every image has a public ID for Cloudinary or similar services
            },
        },
    ],
}, { timestamps: true });  // Automatically manages createdAt and updatedAt

export default mongoose.model('Blog', BlogSchema);
