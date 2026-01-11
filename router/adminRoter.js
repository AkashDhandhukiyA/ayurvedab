const express =require("express");
const AdminRouter =express.Router();
const Admincontroller =require("../controller/admincontroller");
AdminRouter.post("/admin/Add-Product",Admincontroller.postProductData);
AdminRouter.get("/admin/viewProduct/:id",Admincontroller.getviewProData);
AdminRouter.put("/admin/updateproduct/:id",Admincontroller.PutUpdateToProduct);
AdminRouter.delete("/admin/delete/:id",Admincontroller.RemoveToProduct);
//admin Blog Router
AdminRouter.post("/blog", Admincontroller.postAddToBlog);
AdminRouter.get("/admin/blog/:id",Admincontroller.getviewsblog);
AdminRouter.put("/admin/updateblog/:id",Admincontroller.putupateblog);
AdminRouter.delete("/admin/blogdelete/:id",Admincontroller.removetoblog)
module.exports=AdminRouter;


