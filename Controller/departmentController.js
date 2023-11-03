const Department =require("../Models/departmentModel");
const catchAsync = require("../utils/catchAsync");

exports.AddDepartments = catchAsync(async(req,res) => {
    const newDepartment = await Department.create({
        ...req.body,
    });
    res.status(201).json({
        status:"Success",
        data:newDepartment
    })
})