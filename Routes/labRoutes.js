const express = require('express');
const { protect } = require("../Controller/authController");
const labController = require("../Controller/labsController")

const router = express.Router();

router.post("/add", labController.addLab);
router.get("/getLabs", labController.getLabs);

module.exports = router;