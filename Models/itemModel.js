const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "Item name is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Item quantity is required"],
    min: 0,
  },
  unit: String,
  itemType: {
    type: String,
    enum: ["issuable", "consumables", "minor", "major"],
    required: [true, "Please the item type."],
    min: 1,
  },
  limit: Number,
  isSTC: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

module.exports = mongoose.model("itemModel", ItemSchema);
