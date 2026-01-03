const express=require("express");
const { ProductController,creatProduct, updatProduct, deleteProduct, productDetail } = require("../controllers/productControoler");
const {isAuthUser, authrizeRole} = require("../middleware/auth");
// const { creatProduct } = require("../controllers/product");
const router=express.Router();
router.route("/product").get(isAuthUser,authrizeRole("admin"),ProductController);
router.route("/productCreate").post(isAuthUser,creatProduct);
router.route("/product/:id").put(isAuthUser,updatProduct);
router.route("/product/:id").delete(isAuthUser,deleteProduct);
router.route("/product/:id").get(productDetail);

module.exports=router;  