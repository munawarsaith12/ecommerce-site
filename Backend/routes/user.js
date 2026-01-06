const express=require("express");
const { registationControoler,
     loginUser, 
     logOut, 
     forgetPassword,
      userDetail,
       updatePassword } = require("../controllers/user");
const { isAuthUser } = require("../middleware/auth");
const router=express.Router();
router.route("/register").post(registationControoler);
router.route("/login").post(loginUser);
router.route("/password/forget").post(forgetPassword);
router.route("/logOut").get(logOut);
router.route("/password/forget/:Token");
router.route("/userDetail").get(isAuthUser,userDetail);
router.route("/password/update").put(isAuthUser,updatePassword)
module.exports=router;