const express = require("express");
const applicationController = require("../Controller/applicationController");

const router = express.Router();

router.post("/accept", applicationController.acceptApplication);

module.exports = router;
