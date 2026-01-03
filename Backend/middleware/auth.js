const jwt=require("jsonwebtoken")
const ErrorHanddleer = require("../utils/error")
const User=require("../model/user")
const asyncfunHnadle=require("./asynerror")
const isAuthUser=asyncfunHnadle(async (req,res,next)=>{
    const{token}=req.cookies;
    if(!token){
        next(new ErrorHanddleer(401,"login not authorize"));
    }
    const decoded=jwt.verify(
        token,
        process.env.SECURITY_KEY
    );
    req.user=await User.findById(decoded.id)
    next();
});


//role base 
const authrizeRole=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next(new ErrorHanddleer(`role not ${req.user.role} for `,403));
        }
        next();
    }

}
// module.exports=authrizeRole;
module.exports={
    isAuthUser,
    authrizeRole
};