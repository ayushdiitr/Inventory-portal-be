const LabModel = require("../Models/labModel");
const DepartmentModel = require("../Models/departmentModel");

exports.addLab = async (req, res) => {
  const { name, email, contactNumber, department, facultyCoordinator } = req.body; //the department will be a drop down in the frontend
  try {
    const foundDepartment = await DepartmentModel.findOne({ name: department });
    if (foundDepartment) {
      const id = foundDepartment._id;
      const newLab = await LabModel.create({
        name: name,
        email: email,
        contactNumber: contactNumber,
        department: id,
        facultyCoordinator: fc,
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
    console.log(e);
  }
};

exports.getLabs = async (req, res) => {
  const labList = await LabModel.find().populate(
    "department"
  );
  if (labList) {
    return res.status(200).json({
      status: "Success",
      data: labList,
    });
  } else {
    return res.json({
      message: "Labs not found",
    });
  }
}


