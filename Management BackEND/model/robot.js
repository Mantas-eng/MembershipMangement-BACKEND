import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    membershipPlan: String,
});

const Robot = mongoose.model('Robot', UserSchema);

export default Robot;