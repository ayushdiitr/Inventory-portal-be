const mongoose = require("mongoose");

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
  issuedFrom:{
    issuer:{
      type:String,
      required:[true,"issuer is required"]
    },
    labRef:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"labModel"
    },
    labName: {
      type: String,
      required: false,
    },
    fcName:{
      type:String,
      required:true
    }
  },
  issuedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"labModel" //? but individuals wont be able to access items??
  },
  
  dateOfIssue:{
    type:Date,
    required:[true,"date of issue is required"]
  },
  // Not sure about the use of validity
  // validity:{
  //   type:Date,
  //   required:[true,"validity is required"]
  // },
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
  status:{
    type:String,
    enum:["verified","unverified"],
    default:"unverified"
  }
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
