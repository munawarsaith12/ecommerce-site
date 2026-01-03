const express=require("express");
const { registationControoler, loginUser, logOut, forgetPassword } = require("../controllers/user");
const router=express.Router();
router.route("/register").post(registationControoler);
router.route("/login").post(loginUser);
router.route("/password/forget").post(forgetPassword);
router.route("/logOut").get(logOut);
router.route("/password/forget/:Token")
module.exports=router;