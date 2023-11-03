const express =require("express");
const departmentController=require("../Controller/departmentController");

const router = express.Router();

router
    .post("/add",departmentController.AddDepartments)

module.exports=router;