import mongoose from 'mongoose';
const { Schema } = mongoose;

const DoctorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    bio: {
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
}, { timestamps: true });

export default mongoose.model('Doctor', DoctorSchema);
