const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  type:{
    type:String,
    enum:["Lab Admin","item request"]
  },
  department:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"departmentModel"
  },
  requesterId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userModel"
  },
  concernedUser:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userModel"
  },
  data:{
   type:mongoose.Schema.Types.Mixed
  },
  status:{
    type:String,
    enum:["initiated","accepted","rejected"]
  }
});

module.exports = mongoose.model("applicationModel", ApplicationSchema);
