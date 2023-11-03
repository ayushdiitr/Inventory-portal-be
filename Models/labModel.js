const mongoose = require("mongoose");

const LabSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"name of the lab is required"]
  },
  email:{
    type:String,
    required:[true,"email of the lab is required"]
  },
  contactNumber:{
    type:String,
    required:[true,"contactNumber of lab is required"]
  },
  department:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"departmentModel"
  }
});

module.exports = mongoose.model("labModel", LabSchema);
