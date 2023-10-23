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
    required:[true,"contact number of hte department is required"]
  }
});

module.exports = mongoose.model("departmentModel", DepartmentSchema);
