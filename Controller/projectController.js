const projectModel = require("../Models/projectModel");
const catchAsync = require("../utils/catchAsync");

exports.addProject = catchAsync(async (req, res, next) => {
    const { title, description, department, lab, mentor, mentees } = req.body;
    const existingProject = await projectModel.findOne({ title: title });
    if (existingProject) {
        return res.status(400).json({
            status: "Error",
            message: "Project already exists",
        });
    }
    const newProject = await projectModel.create({
        title: title,
        description: description,
        department: department,
        lab: lab,
        mentor: mentor,
        mentees: mentees,
    });
    res.status(201).json({
        status: "Success",
        data: newProject,
    });
});

exports.newProjectMentee = catchAsync(async (req, res, next) => {
    const { projectId, menteeId } = req.body;
    const project = await projectModel.findById(projectId);
    if (!project) {
        return res.status(404).json({
            status: "Error",
            message: "Project not found",
        });
    }
    project.mentees.push(menteeId);
    await project.save();
    res.status(200).json({
        status: "Success",
        data: project,
    });
}
);

exports.getAllProjects = catchAsync(async (req, res, next) => {
    const projects = await projectModel.find();
    res.status(200).json({
        status: "Success",
        data: projects,
    });
})

