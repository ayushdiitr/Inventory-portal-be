const express = require("express");
const { protect } = require("../Controller/authController");
const logsController = require("../Controller/logsController");

const router = express.Router();

router.post("/issueitem/:id/:qty", protect, logsController.issueItem);
router.get("/getitems", protect, logsController.GetItems);
router.get("/getPendingItems", protect, logsController.GetPendingItems);
router.post("/return/:id", protect, logsController.ReturnItem);
router.post("/transfer/:id", protect, logsController.TransferItem);
router.get("/delete", protect, logsController.deleteAll);
router.post("/addItem/:id/:qty", protect, logsController.addItem);
router.get("/approve/:id", logsController.approveIssue);


module.exports = router;
