const ErrorHanddleer = require("../utils/error");

const errorMiddleWar=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 400;
    err.message=err.message || "internal server error";

    if(err.name==="CastError"){
        const message=`resourse not found invlid :${err.path}`;
        err= new ErrorHanddleer(400,message)
    }
    if(err.code===11000){
        const mesaage=`duplcate${Object.keys(err.keyValue)} entered`
        err=new ErrorHanddleer(400,mesaage);
    }

    if(err.name==="jsonwebtoken"){
        const mesaage= "json web token is invalid try again";
        err=new ErrorHanddleer(400,mesaage);
    }
    // wrong jwt 
    if(err.name==="TokenExpireError"){
        const mesaage="json web token is expirr"
        err=new ErrorHanddleer(400,mesaage);
    }
    res.status(err.statusCode).json({
        success:false,
        error:err.message,
    })
}
module.exports=errorMiddleWar;