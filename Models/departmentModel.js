const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"name of the department is required"]
  },
  email:{
    type:String,
    required:[true,"email of the department is required"]
  },
  contactNumber:{
    type:String,
    required:[true,"contact number of the department is required"]
  },
  labs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"labModel"
  }],
  HOD:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userModel"
  }
});

module.exports = mongoose.model("departmentModel", DepartmentSchema);
