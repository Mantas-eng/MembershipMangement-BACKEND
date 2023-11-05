import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
});

export const Service = mongoose.model('Service', serviceSchema);