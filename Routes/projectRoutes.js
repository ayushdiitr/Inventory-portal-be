const express = require("express");
const  projectController  =  require("../Controller/projectController");

const router = express.Router();

router.get("/", projectController.getAllProjects);
router.post("/add", projectController.addProject);
router.post("/addMentee", projectController.newProjectMentee);

module.exports = router;