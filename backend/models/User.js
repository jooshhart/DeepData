const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        unique: true
    },
    subscriptionDate: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Pre-save hook to encrypt the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare plain password with hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;