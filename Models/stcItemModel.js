const mongoose = require("mongoose");

const StcItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    unique: [true, "Name should be unique."],
    required: [true, "Item name is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Item quantity is required"],
    min: 1,
  },
  isVerifiedBySecy: {
    type: Boolean,
    default: false,
  },
  isVerifiedByFaculty: {
    type: Boolean,
    default: false,
  },
  issueStatus: {
    type: String,
    enum: ["processing", "issued", "failed"],
    default: "processing",
  },
});

module.exports = mongoose.model("stcItemModel", StcItemSchema);
