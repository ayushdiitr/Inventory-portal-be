const LabModel = require("../Models/labModel");
const DepartmentModel = require("../Models/departmentModel");

exports.addLab = async (req, res) => {
  const { name, email, contactNumber, department } = req.body; //the department will be a drop down in the frontend
  try {
    const foundDepartment = await DepartmentModel.findOne({ name: department });
    if (foundDepartment) {
      const id = foundDepartment._id;
      const newLab = await LabModel.create({
        name: name,
        email: email,
        contactNumber: contactNumber,
        department: id,
      });
      if (newLab) {
        res.status(201).json({
          status: "success",
          data: newLab,
        });
      } else {
        res.status(400).json({
          status: "error",
          message: "Something went wrong",
        });
      }
    }
  } catch (e) {
    console.log(error);
  }
};
