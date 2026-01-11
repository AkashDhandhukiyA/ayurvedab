const product = require("../model/product");
const PRODUCT = require("../model/product");
const USER = require("../model/user");
const fs = require("fs");
// exports.postProductData = async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       brand,
//       description,
//       price,
//       discount,
//       rating,
//       ingredients,
//       stock,
//       inStock,
//     } = req.body;

//     // Convert ingredients (string → array)
//     const ingredientList =
//       typeof ingredients === "string"
//         ? ingredients.split(",").map((i) => i.trim())
//         : ingredients;

//     // Image path
//     const image = req.file ? req.file.path : null;

//     // FINAL PRICE (main logic)
//     const finalprice = price - discount;

//     // Create product object
//     const product = new PRODUCT({
//       name,
//       category,
//       brand,
//       description,
//       price,
//       discount,
//       finalprice, // <-- added
//       rating,
//       ingredients: ingredientList,
//       stock,
//       inStock,
//       image,
//     });

//     await product.save();

//     res.status(200).json({
//       success: true,
//       message: "Product saved successfully",
//       product,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Error: Product not saved",
//       error: error.message,
//     });
//   }
// };

exports.getproductData = async (req, res, next) => {
  try {
    const product = await PRODUCT.find();
    res
      .status(200)
      .json({ success: true, message: "get data to product", product });
  } catch {
    res
      .status(404)
      .json({ success: false, message: "not get data to product" });
  }
};
exports.getviewProData = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await PRODUCT.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
exports.postAddToFavourites = async (req, res) => {
  try {
    console.log("BODY ID:", req.body.id);
    console.log("SESSION USER ID:", req.session.userId);

    const productId = req.body.id;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const user = await USER.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.favorite.includes(productId)) {
      return res.json({ success: true, message: "Already in favourites" });
    }

    user.favorite.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to favourites",
      favourite: user.favorite,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getfavourites = async (req, res, next) => {
  try {
    const userId = req.session.userId; // FIX – must match login session key

    if (!userId) {
      return res
        .status(401)
        .json({ success: true, message: "User not logged in!" });
    }

    const user = await USER.findById(userId).populate("favorite");

    if (!user) {
      return res
        .status(404)
        .json({ success: true, message: "User not found!" });
    }

    // FIX – send key: favoriteProducts (frontend expects this)
    res.status(200).json({
      success: true,
      message: "Favorites fetched successfully",
      favoriteProducts: user.favorite,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deletefavoritespro = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const productId = req.body.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: true, massage: "PLASE LOGIN FIRST " });
    }
    if (!productId) {
      return res
        .status(401)
        .json({ success: true, massage: "product is not found" });
    }
    const user = await USER.findByIdAndUpdate(
      userId,
      { $pull: { favorite: productId } },
      { new: true }
    ).populate("favorite");

    res.status(200).json({
      success: true,
      massage: "REMOVED FROM FAVOURITES",
      favoriteProducts: user.favorite,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
exports.PostAddToBag = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const productId = req.body.id;
    if (!userId) {
      return res.json({ success: false, massage: "PLASE USER LOGGED IN!" });
    }
    if (!productId) {
      return res.json({ success: false, massage: "product id is required" });
    }
    const user = await USER.findById(userId);
    if (!user) {
      return res.json({ success: false, massage: "user is not found" });
    }
    if (user.bag.includes(productId)) {
      return res.status(500).json({ success: true, massage: "ALERDY IN BAG!" });
    }
    user.bag.push(productId);
    await user.save();
    res.status(200).json({ success: true, massage: "PRODUCT ADDED TO BAG!" });
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
exports.getBagProduct = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res
        .status(404)
        .json({ success: false, massage: "user not logged in!" });
    }
    const user = await USER.findById(userId).populate("bag");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, massage: "user not found!" });
    }
    res.status(200).json({
      success: true,
      massage: "get bag product",
      BagProduct: user.bag,
    });
  } catch (error) {
    res.json({ error: error });
  }
};
exports.removeToBagPro = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const productId = req.body.id;
    if (!userId) {
      return res
        .status(500)
        .json({ success: false, massage: "user not logged in!" });
    }
    if (!productId) {
      return res
        .status(401)
        .jsoon({ success: false, massage: "productId is required" });
    }

    const user = await USER.findByIdAndUpdate(
      userId,
      { $pull: { bag: productId } },
      { new: true }
    ).populate("bag");

    res
      .status(200)
      .json({ success: true, massage: "remove to bag ", BagProduct: user.bag });
  } catch (error) {
    res.status(404).json({ status: false, error: error });
  }
};
// exports.PutUpdateToProduct = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const product = await PRODUCT.findById(id);
//     if (!product) {
//       return res
//         .status(401)
//         .json({ success: false, message: "product not found" });
//     }
//     //parse ingredients (string to arrays);

//     const ingredientsArray = [];
//     if (req.body.ingredients) {
//       try {
//         const ingredientsArray = JSON.parse(req.body.ingredients);
//       } catch (error) {
//         res.json({ success: false, message: "incredients not found!" });
//       }
//     }
//     //udate the product

//     product.name = req.body.name || product.name;
//     product.category = req.body.category || product.category;
//     product.brand = req.body.brand || product.brand;
//     product.description = req.body.description || product.description;
//     product.price = req.body.price || product.price;
//     product.discount = req.body.discount || product.discount;
//     product.stock = req.body.stock || product.stock;
//     product.instock = req.body.instock === "true" ? true : false;

//     if (ingredientsArray.length < 0) {
//       product.ingredients = ingredientsArray;
//     }
//     if (req.file) {
//       const oldImagepath = path.join("/upload", product.image);
//       if (fs.existsSync(oldImagepath)) {
//         fs.unlinkSync(oldImagepath);
//       }
//       product.image = req.file.filename;
//     }
//     await product.save();
//     res.json({ message: "product updated succesfully!" });
//   } catch (error) {
//     res.json({ error: error });
//   }
// };
// exports.RemoveToProduct = async (req, res, next) => {
//   try {
//     const productId = req.body.id;
//     if (!productId) {
//       return res
//         .status(404)
//         .json({ success: false, message: "productID not found!" });
//     }
//     const product = await PRODUCT.findById(productId);
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "product not found!" });
//     }
//     const productRemove = await PRODUCT.findOneAndDelete(productId);

//     res
//       .status(200)
//       .json({
//         success: true,
//         message: "PRODUCT REMOVE TO PRODUCT!",
//         productRemove,
//       });
//   } catch (error) {
//     res.json({ message: "server error !" });
//   }
// };
