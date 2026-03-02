import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            default: 'admin',
        },
    }, { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export { Admin };