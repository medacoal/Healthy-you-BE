import mongoose from 'mongoose';
const { Schema } = mongoose;

const SubscribeSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Invalid email format'
        ]
    }
}, {timestamps: true});

export default mongoose.model('Subscribe', SubscribeSchema);