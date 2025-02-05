import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
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
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {timestamps: true});

export default mongoose.model('User', UserSchema);