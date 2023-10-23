const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({

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
contactNumber: {
    type: Number,
    required: [true, "Please provide Contact Number"]
}
});

module.exports = mongoose.model("departmentModel", departmentSchema );
