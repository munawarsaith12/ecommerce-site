const asyncfunHnadle=require("../middleware/asynerror")
const Product=require("../model/product")
const express=require("express");
const ErrorHanddleer=require("../utils/error");
const ApiFeature = require("../utils/apiFeature");
const ProductController=asyncfunHnadle(async(req,res)=>{
    const resultPerPage=5;
    try {
        const apiFeature=new ApiFeature(Product.find({}),req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
        const product=await apiFeature.query;
    res.status(200).json({
        success:true,
        product
    })
    } catch (error) {
        res.status(400).json({
            success:false,
            message: error.message
        })
    }
});
// create product on data base
const creatProduct=async(req,res,next)=>{
    // const productBody=req.body;
    try {
        const product = await Product.create(req.body); // ✅ works now
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// get product detail
const productDetail=asyncfunHnadle(async(req,res,next)=>{
    try {
    const productId=req.params.id;
    const product=await Product.findById(productId);
    if(!product){
   return next(new ErrorHanddleer(400,"product not found",))
    }
    res.status(200).json({
        success:true,
        product,
    })    
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }

});

// updat product on data base
const updatProduct=asyncfunHnadle(async(req,res,next)=>{
    try {
        const productId=req.params.id;
        const updateData=req.body;
        const updatProduct=await Product.findByIdAndUpdate(productId,updateData,{new:true,runvalidators:true});
        if(!updatProduct){
            return next(new ErrorHanddleer(400,"product not found",))
        }
        res.status(200).json({
            success:true,
            updatProduct,
        })
    } catch (error) {
        console.log("error is",error)
    }
})

// delete product
const deleteProduct=asyncfunHnadle(async(req,res,next)=>{
    const productId=req.params.id;
    const product=await Product.findByIdAndDelete(productId);
    if(!product){
       return next(new ErrorHanddleer(400,"product not found",))
    }
    res.status(400).json({
        success:true,
        message:"product delete successfuly"
    })
});

module.exports={
    ProductController,
    creatProduct,
    updatProduct,
    deleteProduct,
    productDetail
}