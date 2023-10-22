const mongoose = require("mongoose");
const userSchema = require("./userModel");

const LogsSchema = new mongoose.Schema({
  
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "itemModel",
    required: [true, "Please provide the refrence id."],
  },
  quantity: {
    type: Number,
    required: [true, "Please enter quantity"],
    min: 1,
  },
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  issueDate: {
    type: String,
    required: true,
    default: new Date(),
  },
  returnDate: {
    type: String,
    default: null,
  },
  holderName: {
    type: String,
    required: [true, "Holder's name is required"],
  },
  contactNumber: {
    type: Number,
    required: [true, "Contact number is required"],
    match: [
      /^(\+\d{1,3}[- ]?)?\d{10}$/,
      "Enter a valid Mobile Number",
    ],
  },
  projectName: {
    type: String,
    // required: [true, "Project name is required"],
  },
  description: {
    type: String,
    default: "NA",
  },
  returnStatus: {
    type: Boolean,
    default: true,
  },
});

LogsSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "item issuer",
    strictPopulate: false,
    select: "-__v",
  });
  next();
});

module.exports = mongoose.model("logsModel", LogsSchema);
