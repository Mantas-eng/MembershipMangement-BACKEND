import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    membershipPlan: String,
    IP: String
});

export const User = mongoose.model('User', userSchema);