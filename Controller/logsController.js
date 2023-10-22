const Logs = require("../Models/logsModel");
const Item = require("../Models/itemModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const mailService = require("../utils/mailSerive");

exports.issueItem = catchAsync(async (req, res, next) => {
  const newItem = await Logs.create({
    ...req.body,
  });
  let id = req.params.id;
  let qty = req.params.qty;
  let item = await Item.findById(id);
  item.quantity -= qty;

  if (item.quantity <= 2 * item.limit) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "rethinktinkering@iitr.ac.in",
      subject: `Inventory Alert for ${item.itemName}`,
      text: `Dear Sir,
This email is regarding low inventory of ${item.itemName}. 
Current quantity: ${item.quantity}.
Maximun issuable quantity: ${item.limit}. 
Thank you for taking the time to read our email.
Regards,
Tinkering Lab Students' Body`,
    };
    mailService.sendMail(mailOptions, function (err) {
      if (err) {
        return next(new AppError(err.message, err.statusCode));
      } else {
        console.log("Mail sent successfully!");
      }
    });
  }

  await item.save();

  res.status(201).json({
    status: "Success",
    data: newItem,
  });
});

exports.addItem = catchAsync(async (req, res, next) => {
  const newItem = await Logs.create({
    ...req.body,
  });
  const id = req.params.id;
  const qty = req.params.qty;
  const item = Item.findById(id);
  item.quantity += qty;
  await item.save;

  res.status(201).json({
    status: "success",
    data: newItem,
  });
});

exports.GetItems = async function getItem(req, res) {
  let itemList = await Logs.find();
  if (itemList) {
    return res.status(200).json({
      status: "Success",
      data: itemList,
    });
  } else {
    return res.json({
      message: "Logs not found",
    });
  }
};

exports.ReturnItem = catchAsync(async (req, res, next) => {
  let id = req.params.id;
  let qty = 0;
  let item = await Logs.findById(id);
  if (item.returnStatus === true) {
    qty = item.quantity;
    // date = String(new Date());
    const d = new Date();
    item.returnDate = d.toLocaleDateString();
    item.returnStatus = false;
  }
  item.item.quantity += qty;
  await item.item.save();
  const updatedData = await item.save();
  res.status(200).json({
    status: "Success",
    data: updatedData,
  });
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  await Logs.deleteMany();

  res.status(204).json({
    status: "success",
  });
});
