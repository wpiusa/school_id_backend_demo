import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    shortId: {
        type: String,
    },
    longId: {
        type: String,
    },
    school: {
        type: String,
    },
    grade: {
        type: String,
    },
    sixPeriod: {
        type: String,
    },
    lunchPeriod: {
        type: String,
    },
    ASB: {
        type: String,
    },
    profileURL: {
        type: String,
    },
    status: {
        type: String,
    },
    userType: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
});