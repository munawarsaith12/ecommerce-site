const express=require("express");
const app=express();
const routerProduct=require("./routes/productRoutes");
const userRoutes=require("./routes/user")
const dbConnect = require("./helper/dbConnect");
const errorMiddleWar = require("./middleware/errrorHandler");
const path=require("path");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
require('dotenv').config({path:path.join((__dirname,"./config/.env"))});
const PORT=4000;
dbConnect();
process.on("uncaughtException",(err)=>{
   console.log(`error${err}`);
    console.log("shoting down the server due to the  uncaught Exception");
})
app.use(express.json());
app.use("/api",routerProduct);
app.use("/api/user",userRoutes)
app.use(errorMiddleWar)
const server=app.listen(PORT,()=>{
    console.log("app is listen on port :")
});

// unhandle  rejection
process.on("unhandledRejection",(err)=>{
    console.log(`error${err}`);
    console.log("shoting down the server due to the promise unhandle rejection");
    server.close(()=>{
        process.exit(1);
    })
});




