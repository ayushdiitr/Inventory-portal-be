import express from "express";
import projectController from "../Controller/projectController";

const router = express.Router();

router.get("/", projectController.getAllProjects);
router.post("/add", projectController.addProject);
router.post("/addMentee", projectController.newProjectMentee);

module.exports = router;