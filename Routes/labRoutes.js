const express = require('express');
const { protect } = require("../Controller/authController");
const labController = require("../Controller/labsController")

const router = express.Router();

router
    .post("/addLab",labController.addLab);

module.exports = router;