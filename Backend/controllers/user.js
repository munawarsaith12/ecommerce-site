const bcrypt=require("bcrypt");
const User=require("../model/user");
const Tokenjwt = require("../utils/tokenJwt");
const asyncfunHnadle=require("../middleware/asynerror");
const ErrorHanddleer = require("../utils/error");
const { options } = require("../routes/user");
const sendEmail=require("../utils/sendEmail")
// rregistation form user
const registationControoler=async(req,res,next)=>{
  try {
      const {name,email,password,role}=req.body;
     if(!name|| !email || !password){
      return res.status(400).json({
        success:false,
        message:"user not found",
      })
     }
     const userExit=await User.findOne({email});
     if(userExit){
       return res.status(400).json({
        success:false,
        message:"useralready exit",
      })
     }
     const user=await User.create({name,email,password,role});
     const Token= user.getJwtToken();
     Tokenjwt(user,201,res)
  } catch (error) {
    next(error)
  }    
}



 // Login functionality user
const loginUser=asyncfunHnadle(
    async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return next(new ErrorHanddleer(400,"pleace correct  email & password "));
    }
    const user=await User.findOne({email});
    if(!user){
        return next(new ErrorHanddleer(400,"correct  email & password"))
    }
    const passwordMatch=await user.comparePassword(password);
    if(!passwordMatch){
      return next(new ErrorHanddleer(400,"correct  email & password"))
    }
    Tokenjwt(user,200,res);
}
)





// forget password
const forgetPassword=asyncfunHnadle(async (req,res,next)=>{
  const user=await User.findOne({email:req.body.email});
  console.log(user);
  if(!user){
    return next(new ErrorHanddleer(400,"hi"));

  }
  // call the foeget password 
  const resetToken=user.forgetPassordtok();
  console.log(resetToken);
  // save the database
  
  await  user.save({validateBeforeSave:false});
  // link forget password 
  const resetUrl=`${req.protocol}://${req.get("host")}/password/reset${resetToken}`;
    console.log(resetUrl);
const message=`your reset password token is: \n\n ${resetUrl} if you have not requested than pleace ignore it`
  try {
     sendEmail({
      email:user.email,
      subject:"ecomerce password",
      message,
    });
    res.status(200).json({
      success:true,
      message:`email send to ${user.email} to successfully`
    })
  } catch (error) {
   user.resetToken=undefined;
  user.expireDate=undefined;
  return  res.status(400).json({
      success:false,
      message:"err on user not here found"
    })
  }


} )

// reset password 
const restePassword= asyncfunHnadle(async(req,res,next)=>{
  // creating hash token 
  const resetPasswordToken=crypto.createHash("sha256")
  .update(req.params.Token)
  .digest("hex");

  //find a user in data base
  const user=await User.find({
    resetPasswordToken,
    expireDate:{$gt:Date.now()},
  });
  if(!user){
    return next(new ErrorHanddleer(400,"reset password token if failed"));
  }
  if(req.body.password !==req.body.confirmPassword){
    return next(new ErrorHanddleer(400,"reset password token if failed"));
  }


  user.password=req.body.password;
  user.resetToken=undefined;
  user.expireDate=undefined;

  await user.save();

  sendToken(user,200,res)
}
)


// logout user
const logOut=asyncfunHnadle(async (req,res,next)=>{
  res.cookie("token",null,options ,{
    expires: new Date(Date.now),
    http:true
  });
  res.status(200).json({
    success:true,
    message:"user logOut success full",
  })
})




// get user detail 
const userDetail=asyncfunHnadle(async(req,res,next)=>{
  const userId=req.user.id;
  const user=await User.findById(userId);
  // not user in data  base
  if(!user){
    return next(new ErrorHanddleer(400,"user not found"));
  }

  res.status(200).json({
    success:true,
    message:"user detail are",
    user,
  })

})

// update password 
const updatePassword=asyncfunHnadle(async(req,res,next)=>{
  const userId=req.user.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

if (!oldPassword || !newPassword || !confirmPassword) {
  return next(new ErrorHanddleer(400, "All fields are required"));
}
console.log(oldPassword);
console.log(newPassword);


  const user=await User.findById(userId).select("+password");
  // not user in data  base
  if(!user){
    return next(new ErrorHanddleer(400,"user not found"));
  }

  const passwordMatch=await user.comparePassword(oldPassword);
    if(!passwordMatch){
      return next(new ErrorHanddleer(400,"correct old pas email & password"))
    }

    if(newPassword!==confirmPassword){
      return next(new ErrorHanddleer(400,"correct not new paasord & password"))
    }

    user.password=req.body.newPassword;
    console.log(user);
    await user.save();
  res.status(200).json({
    success:true,
    message:"user detail are",
    user,
  })

})

module.exports={
    registationControoler,
    loginUser,
    logOut,
    forgetPassword,
    restePassword,
    userDetail,
    updatePassword,
}