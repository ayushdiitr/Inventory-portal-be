const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Please provide email address"],
        unique: [true, "Email must be unique"],
        validate: [validator.isEmail, 'Please Enter A valid E-mail']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    designation: {
        type: String,
        required: [true, "Please provide designation"],
    },
    contactNumber: {
        type: Number,
        required: [true, "Please provide Contact Number"]
    },
    role: {
        type: String,
        enum: ["admin", "user", "stc"]
    }
});

UserSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

UserSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}


module.exports = mongoose.model("userModel", UserSchema)