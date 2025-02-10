import mongoose from 'mongoose';
const { Schema } = mongoose;

const ContactSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 160,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Invalid email format'
        ]
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    
}, {timestamps: true});

export default mongoose.model('Contact', ContactSchema);