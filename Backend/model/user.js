const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const crypto=require("crypto")
const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
       type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    forgetPassword:String,
    expireDate:Date
});
userSchema.pre("save", async function() { // Remove 'next' here
    if (!this.isModified("password")) {
         return; // Just return; Mongoose knows you are done
    }
    
    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.getJwtToken = function() {
    const secret = process.env.SECURITY_KEY ;
    const expires = process.env.EXPIRE_KEY ;
    return jwt.sign({ id: this._id }, secret, { expiresIn: expires });

};
userSchema.methods.comparePassword= async function  (enterpassword){
    return await bcrypt.compare(enterpassword,this.password);
};
userSchema.methods.forgetPassordtok= function() {
    const resetPassword=crypto.randomBytes(20).toString("hex");
    this.forgetPassword=crypto.createHash("sha256").update(resetPassword).digest("hex");
    this.expireDate=Date.now()+15*60*1000;
    return resetPassword;
}

const User= mongoose.model("User",userSchema);

module.exports  =User;