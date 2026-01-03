
const Product=require("../model/product")


const creatProduct=async(req,res,next)=>{
    const productBody=req.body;
     const product =await Product.create(productBody);
    res.status(201).json({
        success:true,
        product,
    })
}
module.exports={
    creatProduct,
}