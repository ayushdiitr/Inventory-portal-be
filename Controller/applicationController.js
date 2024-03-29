const applicationModel = require("../Models/applicationModel");
const departmentModel = require("../Models/departmentModel");
const labModel = require("../Models/labModel");
const userModel = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.acceptApplication = catchAsync(async(req,res,next)=>{
    const {applicationId} = req.body

    const foundApplication = await applicationModel.findById(applicationId)

    if(!foundApplication){
        return res.status(400).json({
            status: 'fail',
            message: 'application not found'
          });
    }

    if(foundApplication.type === "Lab Admin"){
        const newLab = await labModel.create({
            name:foundApplication.data.labName,
            email:foundApplication.data.labEmail,
            contactNumber:foundApplication.data.labContactNumber,
            department:foundApplication.department,
            facultyCoordinator:foundApplication.requesterId
        })

        const requesterId = foundApplication.requesterId;
        await userModel.findByIdAndUpdate(requesterId,{$set:{roles:{role:"Lab Admin",lab:newLab._id}}},{new:true})
        const updatedDepartment = await departmentModel.findByIdAndUpdate(foundApplication.department, { $push: { labs: newLab._id } }, { new: true });
        if (!updatedDepartment) {
            console.log('Department not found');
          }
          console.log('Updated department:', updatedDepartment);
    }
    else if(foundApplication.type === "item request"){
        //!not complete
        const requesterId = foundApplication.requesterId;
        const item = foundApplication.data.item;
        const quantity = foundApplication.data.quantity;
        const lab = foundApplication.data.lab;
        const labAdmin = foundApplication.data.labAdmin;
        const itemRef = await itemModel.findById(item);
        const labRef = await labModel.findById(lab);
        const labAdminRef = await userModel.findById(labAdmin);
        const newLog = await logsModel.create({
            item:itemRef,
            quantity:quantity,
            issuedFrom:{
                labRef:labRef,
                labName:labRef.name,
                fcRef:labAdminRef,
                fcName:labAdminRef.name
            },
            issuedTo:requesterId
        })
        const updatedUser = await userModel.findByIdAndUpdate(requesterId,{$push:{issuedItems:{itemRef:itemRef,logRef:newLog._id}}},{new:true})
        if(!updatedUser){
            console.log('User not found');
          }
          console.log('Updated user:', updatedUser);
    }

    foundApplication.status = "accepted"
    await foundApplication.save();

    return res.status(200).json({
        status: 'success',
        message: 'Application accepted'
    })
})  

