const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  // userId: {
  //   type: Number,
  //   required: [true,"userId is required"]
  // },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Please provide email address"],
    unique: [true, "Email must be unique"],
    validate: [validator.isEmail, "Please Enter A valid E-mail"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  /* removed required attribute because when adding staff the lab admin has to fill these informations , instead we can make the staff himself add the info */
  designation: {
    type: String,
    // required: [true, "Please provide designation"], 
  },
  contactNumber: {
    type: Number,
    // required: [true, "Please provide Contact Number"],
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "departmentModel",
  },
  roles: 
    {
        role:{
            type:String,
            enum: ["HOD", "Lab Admin", "Staff", "User"],
            required: true,
        },
        lab: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'labModel',
          },
    },
  projects:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"projectModel"
    }
  ],
  projectMentors:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"projectModel"
    }
  ],
  issuedItems:[
    {
        itemRef:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"itemModel"
        },
        logRef:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"logsModel"
        }
    }
  ],
  firstLogin:{
    type:Boolean,
    required:true
  }
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("userModel", UserSchema);
