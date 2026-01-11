const express = require("express");
const userRouter = express.Router();

const usercontroller = require("../controller/usercontroller");

userRouter.post("/register", usercontroller.postregistration);
userRouter.post("/login",usercontroller.postlogin);
userRouter.get("/check-auth",usercontroller.checkauth);
userRouter.post("/logout",usercontroller.postlogout);
module.exports = userRouter;
