const express = require("express");
const authController = require("../Controller/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/refresh", authController.refreshController);
router.get("/getAllUsers", authController.getAllUsers);
router.post("/addUser", authController.addUser);
router.post("/searchUsers", authController.searchUsers);
router.post("/updateUser/:id", authController.updateUser);
router.post("/user",authController.userSignUp);
router.post("/add/hod",authController.addHOD);
router.post("/add/lab",authController.requestLab);
router.post("/admin/login",authController.getAdminDashboard);
router.post("/staff/add",authController.addStaff);
router.post("/oauth/login",authController.oAuthLogin)
module.exports = router;
