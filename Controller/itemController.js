const { findById } = require("../Models/itemModel");
const Item = require("../Models/itemModel");
const Lab = require("../Models/labModel");
const Log = require("../Models/logsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.AddItems = catchAsync(async (req, res) => {
    //!shouldnt we first check if the item is already in the database and then push the owner in the owners array
    const newItem = await Item.create({
        ...req.body,
    });
    res.status(201).json({
        status: "success",
        data: newItem,
    });
});

exports.GetItems = catchAsync(async (req, res) => {
    const itemList = await Item.find({ active: { $ne: false } });

    res.status(200).json({
        status: "success",
        data: itemList,
    });
});
// For get a single item
exports.GetItem = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const item = await Item.findOne({ _id: id });
    const lab = await Lab.findById(item.lab);
    console.log(lab.name);
    return res.status(200).json({
        status: "success",
        data: item,
        labName: lab.name,
    });
});

exports.UpdateItems = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const item = await Item.findById(id);
    const qty = parseInt(req.params.qty);
    item.quantity += qty;
    await item.save();
    res.status(200).json({
        status: "success",
    })

});

exports.UpdateItemsData = catchAsync(async (req, res, next) => {
    await Item.updateOne({ _id: req.params.id }, {
        ...req.body,
    });

    res.status(200).json({
        status: "success"
    })
})

exports.DeleteItem = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Item.findByIdAndUpdate({ _id: id }, {
        active: false
    }).select('active');
    res.status(204).json({
        status: "success",
    });
});
exports.DeleteQuantity = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const item = await Item.findById(id);
    const qty = parseInt(req.params.qty);
    item.quantity -= qty;
    await item.save();
    res.status(204).json({
        status: "success",
    })

});

exports.EditItems = catchAsync(async (req, res, next) => {
    try {
        let id = req.params.id;
        let item = await Item.findById(id);
        let newData = req.body;
        if (item) {
            const keys = [];
            for (let key in newData) {
                keys.push(key);
            }

            for (let i = 0; i < keys.length; i++) {
                item[keys[i]] = newData[keys[i]];
            }
            const updatedData = await item.save();
            res.json({
                message: "Data updated successfully",
                data: item
            });
        } else {
            res.json({
                message: "Item not found"
            })
        }
    } catch (error) {
        // let newItem = await Item.findOneAndUpdate(, newData);
        res.json({
            message: err.message,
        });
    }
})
// exports.deleteAll = catchAsync(async (req,res,next) => {
//     await Item.deleteMany();
//     res.status(204).json({
//         status: "success",
//     })
// })
