const Logs = require("../Models/logsModel");
const Item = require("../Models/itemModel");
const Lab = require("../Models/labModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const mailService = require("../utils/mailSerive");

exports.issueItem = catchAsync(async (req, res, next) => {
  let id = req.params.id;
  let qty = req.params.qty;
  let item = await Item.findById(id);
  item.quantity -= qty;
  let lab = await Lab.findById(item.lab);
  const fc = lab.email;
  console.log(fc, "faculty coordinator");
  // const newItem = await Logs.create({
  //   ...req.body,
  // });
  
  const newItem = await Logs.create({
    ...req.body,
    issuedFrom: {issuer: req.body.issuedFrom.issuer, labName: lab.name, fcName: fc},
  });
  
//   if (item.quantity <= 2 * item.limit) {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: "rethinktinkering@iitr.ac.in",
//       subject: `Inventory Alert for ${item.itemName}`,
//       text: `Dear Sir,
// This email is regarding low inventory of ${item.itemName}. 
// Current quantity: ${item.quantity}.
// Maximun issuable quantity: ${item.limit}. 
// Thank you for taking the time to read our email.
// Regards,
// Tinkering Lab Students' Body`,
//     };
//     mailService.sendMail(mailOptions, function (err) {
//       if (err) {
//         return next(new AppError(err.message, err.statusCode));
//       } else {
//         console.log("Mail sent successfully!");
//       }
//     });
//   }

  await item.save();

  if(res.status(201)){
    const mailOptions = {
      from: process.env.EMAIL_USER || "a_dhiman@mt.iitr.ac.in",
      to: fc,
      subject: `Verify issue of inventory ${item.itemName}`,
      html: ` This is to inform you that ${req.body.issuedFrom.issuer} (${req.body.issuedFromEmail}) has requested ${item.itemName} from the inventory.
      <br>Item Details: </br>
      <br>Item Name: ${item.itemName}</br>
      <br>Item ID: ${item._id} (for tracking purpose)</br>
      <br>Item Quantity: ${qty}</br>
      <br>Item Issued To: ${req.body.holderName}</br>
      <br>Contact Number: ${req.body.contactNumber}</br>
      <br>Verify the issue of ${item.itemName} by clicking on the link below:</br>
       <a href='http://localhost:4000/app/v1/logs/approve/${newItem._id}/'>Approve Now</a>
      <br>
      Regards,</br>
      `,      

    };
    mailService.sendMail(mailOptions, function (err) {
      if (err) {
        return next(new AppError(err.message, err.statusCode));
      } else {
        console.log("Mail sent successfully!");
      }
    });
  }

  res.status(201).json({
    status: "Success",
    // data: newItem,
  });
});

exports.approveIssue = catchAsync(async (req, res, next) => {
  let id = req.params.id;
  let item = await Logs.findById(id);
  console.log(item.issuedFrom.fcName);
  item.status = "verified";
  const updatedData = await item.save();
  res.status(200).json({
    status: "Success",
    data: "Item Issued",
  });
  console.log(updatedData);
  const fcName = item.issuedFrom.fcName;
  if(res.statusCode == 200){
    const mailOptions = {
      from: "a_dhiman@mt.iitr.ac.in",
      to: fcName,
      subject: `Issue of inventory ${item.item.itemName}`,
      html: ` This is to inform you that ${item.holderName} has issued ${item.item.itemName} from the inventory.
      <p>Item Details-> </p>
      <p>Item Name: ${item.item.itemName}</p>
      <p>Item ID: ${item._id} (for tracking purpose)</p>
      <p>Lab: ${item.issuedFrom.labName}</p>
      Regards,`,      

    };
    mailService.sendMail(mailOptions, function (err) {
      if (err) {
        return next(new AppError(err.message, err.statusCode));
      } else {
        console.log("Mail sent successfully!");
      }
    });
  }
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
  let itemList = await Logs.find({status:'verified', function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Result : ", docs);
    }
  }});
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

exports.GetPendingItems = async function getItem(req, res) {
  let itemList = await Logs.find({status:'unverified', function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Result : ", docs);
    }
  }});
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

exports.TransferItem = catchAsync(async (req, res, next) => {
  let id = req.params.id;
  let qty = 0;
  let item = await Logs.findById(id);
  const existingLabName = item.issuedFrom.labName;
  const newLabId = req.body.newLabId;
  const newLab = await Lab.findById(newLabId);
  const existingFC = item.issuedFrom.fcName;
  const newFC = newLab.email;
  const d = new Date();
  console.log(existingFC, newFC, "item");
  if (item.returnStatus === true) {
    qty = item.quantity;
    // date = String(new Date());
    item.returnDate = d.toLocaleDateString();
    item.returnStatus = true; //changed to true
  }
  // item.item.quantity += qty;
  item.issuedFrom.labRef = newLabId;
  item.issuedFrom.labName = newLab.name;
  await item.item.save();
  const updatedData = await item.save();

  if(res.statusCode == 200){
    const mailOptions = {
      from: "a_dhiman@mt.iitr.ac.in",
      to: existingFC,
      subject: `Transfer of inventory ${item.item.itemName}`,
      html: ` This is to inform you that ${item.holderName} has requested the transfer of ${item.item.itemName} 
      from ${existingLabName} to ${newLab.name}.
      <p>Item Details-> </p>   
      <p>Item Name: ${item.item.itemName}</p>
      <p>Item ID: ${item._id} (for tracking purpose)</p>
      <p>Date : ${d.toLocaleString()}</p>
      Regards,   
      `,
    };
    const mailToNewLab = {
      from: "a_dhiman@mt.iitr.ac.in",
      to: newFC,
      subject: `Transfer of inventory ${item.item.itemName}`,
      html: ` This is to inform you that ${item.holderName} has transferred ${item.item.itemName} 
      from ${existingLabName} to your Lab ${newLab.name}.
      <p>Item Details-> </p>   
      <p>Item Name: ${item.item.itemName}</p>
      <p>Item ID: ${item._id} (for tracking purpose)</p>
      <p>Date : ${d.toLocaleString()}</p>
      Regards,   
      `,
    };
    mailService.sendMail(mailOptions, function (err) {
      if (err) {
        return next(new AppError(err.message, err.statusCode));
      } else {
        console.log("Mail sent successfully!");
      }
    });
    mailService.sendMail(mailToNewLab, function (err) {
      if (err) {
        return next(new AppError(err.message, err.statusCode));
      } else {
        console.log("Mail sent successfully!");
      }
    });
  }
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
