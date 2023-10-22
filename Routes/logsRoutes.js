const express = require("express");
const { protect } = require("../Controller/authController");
const logsController = require("../Controller/logsController");

const router = express.Router();

router.post("/issueitem/:id/:qty", protect, logsController.issueItem);
router.get("/getitems", protect, logsController.GetItems);
router.post("/return/:id", protect, logsController.ReturnItem);
router.get("/delete", protect, logsController.deleteAll);
router.post("/addItem/:id/:qty", protect, logsController.addItem);

module.exports = router;
