const express = require("express");
const { protect } = require("../Controller/authController");
const itemController = require("../Controller/itemController");

const router = express.Router();

router
  .post("/updateitem/:id", protect, itemController.UpdateItemsData)
  .post("/additem", protect, itemController.AddItems)
  .get("/getitems", protect, itemController.GetItems)
  .get("/getitem/:id", protect, itemController.GetItem)
  .post("/update/:id/:qty", itemController.UpdateItems)
  .post("/deleteitem/:id", itemController.DeleteItem)
  .post("/delete/:id/:qty", protect, itemController.DeleteQuantity);

module.exports = router;
