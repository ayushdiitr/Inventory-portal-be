const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departmentModel",
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "labModel",
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
    },
    mentees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel",
        },
    ]
});

module.exports = mongoose.model("projectModel", ProjectSchema);