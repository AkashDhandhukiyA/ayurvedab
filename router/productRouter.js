
const express = require("express");
const ProductRouter = express.Router();
const productcontroller = require("../controller/productcontroller");

//post add-product
// ProductRouter.post("/Add-Product",productcontroller.postProductData);
//get product display
ProductRouter.get("/product",productcontroller.getproductData);
//viewproduct ://i to accepted
ProductRouter.get("/viewProduct/:id",productcontroller.getviewProData);
//post favorites
ProductRouter.post("/favourites", productcontroller.postAddToFavourites);
//get favorites
ProductRouter.get("/favourites",productcontroller.getfavourites);
// Fix the typo: detele → delete
ProductRouter.post("/favourites/delete", productcontroller.deletefavoritespro);
//post bag 
ProductRouter.post("/bag",productcontroller.PostAddToBag); 
 //get bag
ProductRouter.get("/bag",productcontroller.getBagProduct);
//get delete product
ProductRouter.post("/bag/delete",productcontroller.removeToBagPro);
// ProductRouter.put("/updateproduct/:id",productcontroller.PutUpdateToProduct);
// ProductRouter.delete("/delete/:id",productcontroller.RemoveToProduct);
module.exports = ProductRouter;
