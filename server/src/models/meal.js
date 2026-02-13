import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    category: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }, // in naira
    desc: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ""
    },
    imagUrl: {
        type: String,
        trim: true,
        default: ""
    },
    isAvailavle: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

mealSchema.index({category: 1, price: 1});

export const Meal = mongoose.model('Meal', mealSchema);