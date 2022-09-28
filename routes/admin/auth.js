const express = require("express");
var router = express.Router({ mergeParams: true }),
    passport = require("passport"),
    Admin = require("../../models/admin"),
    { f1aAuth, f2aAuth, f3aAuth, f4aAuth, f5aAuth, f6aAuth, f7aAuth, f8aAuth, f9aAuth, f10aAuth } = require("../../controllers/admin/auth"),
    { isAdmin } = require("../../middleware/index");


// sendSms(9980713205);
// Admin.register(new Admin({email:'naveenkm36@gmail.com',mobile:9980713205}),'1234',(err,admin)=>{
//     if(err){
//         console.log(err)
//     }
// });
// @route to error page
router.get("/error", f3aAuth);
// @route to login page
router.get("/", f1aAuth);

// @route to login via email and password
router.post("/login/email", f2aAuth);

// @route to send forgot password mail
router.post("/forget", f4aAuth);

// @route to get reset page
router.get("/reset/:token", f5aAuth);

// @route to send confirmation after email reset
router.post("/reset/:token", f6aAuth);

// @route to get recovery page
router.get("/recoverypage", f7aAuth);

// @route to logout
router.get("/logout", f8aAuth);

// @route to otp page for login
router.get("/login/otp", f9aAuth);

// @route to post otp  for login
router.post("/login/otp", f10aAuth);

// 


module.exports = router;