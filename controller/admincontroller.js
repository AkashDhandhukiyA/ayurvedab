const PRODUCT = require("../model/product");
const BLOG = require("../model/blog");
const USER = require("../model/user");
const fs = require("fs");
const path = require("path");
exports.postProductData = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      description,
      price,
      discount,
      rating,
      ingredients,
      stock,
      inStock,
    } = req.body;

    // Convert ingredients (string → array)
    const ingredientList =
      typeof ingredients === "string"
        ? ingredients.split(",").map((i) => i.trim())
        : ingredients;

    // Image path
    const image = req.file ? req.file.path : null;

    // FINAL PRICE (main logic)
    const finalprice = price - discount;

    // Create product object
    const product = new PRODUCT({
      name,
      category,
      brand,
      description,
      price,
      discount,
      finalprice, // <-- added
      rating,
      ingredients: ingredientList,
      stock,
      inStock,
      image,
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product saved successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error: Product not saved",
      error: error.message,
    });
  }
};

exports.getviewProData = async (req, res, next) => {
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
exports.PutUpdateToProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await PRODUCT.findById(id);
    if (!product) {
      return res
        .status(401)
        .json({ success: false, message: "product not found" });
    }
    //parse ingredients (string to arrays);

    const ingredientsArray = [];
    if (req.body.ingredients) {
      try {
        const ingredientsArray = JSON.parse(req.body.ingredients);
      } catch (error) {
        res.json({ success: false, message: "incredients not found!" });
      }
    }
    //udate the product

    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.discount = req.body.discount || product.discount;
    product.stock = req.body.stock || product.stock;
    product.instock = req.body.instock === "true" ? true : false;

    if (ingredientsArray.length < 0) {
      product.ingredients = ingredientsArray;
    }
    if (req.file) {
      const oldImagepath = `/uploads/${product.image}`;
      if (fs.existsSync(oldImagepath)) {
        fs.unlinkSync(oldImagepath);
      }
      product.image = req.file.filename;
    }
    await product.save();
    res.json({ message: "product updated succesfully!" });
  } catch (error) {
    res.json({ error: error });
  }
};
exports.RemoveToProduct = async (req, res, next) => {
  try {
    const productId = req.body.id;
    if (!productId) {
      return res
        .status(404)
        .json({ success: false, message: "productID not found!" });
    }
    const product = await PRODUCT.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "product not found!" });
    }
    const productRemove = await PRODUCT.findOneAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "PRODUCT REMOVE TO PRODUCT!",
      productRemove,
    });
  } catch (error) {
    res.json({ message: "server error !" });
  }
};
//blog add-post
exports.postAddToBlog = async (req, res) => {
  try {
    const { name, blogcontain, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const blog = new BLOG({
      name,
      blogcontain,
      description,
      image,
    });
    console.log(blog);
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Data is saved successfully!",
      blog,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
exports.getviewsblog = async (req, res, next) => {
  try {
    const id = req.params.id;
    const blog = await BLOG.findById(id);
    if (!blog) {
      return res
        .status(401)
        .json({ success: false, massage: " bolg is not views!" });
    }
    res.status(200).json({ success: true, massage: "LATE SEE!", blog });
  } catch (error) {
    res.json({ error: error });
  }
};
exports.putupateblog = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const blog = await BLOG.findById(id);
    if (!blog) {
      return res
        .status(401)
        .json({ success: false, message: "BLOG IS NOT FOUND!" });
    }
    //UPDATE
    blog.name = req.body.name || blog.name;
    blog.blogcontain = req.body.blogcontain || blog.blogcontain;
    blog.description = req.body.description || blog.description;

    if (req.file) {
      const oldImagepath = `/uploads/${blog.image}`;
      if (fs.existsSync(oldImagepath)) {
        fs.unlinkSync(oldImagepath);
      }
      blog.image = req.file.filename;
    }
    await blog.save();
    console.log(blog);
    res
      .status(200)
      .json({ success: true, message: "DATA / PRODUCT IS UPDATED !" });
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
exports.removetoblog = async (req, res, next) => {
  try {
    const blogId = req.body.id;
    if (!blogId) {
      return res
        .status(401)
        .json({ success: false, message: "blog not id found!" });
    }
    const blog = await BLOG.findById(blogId);
    if (!blog) {
      return res
        .status(401)
        .json({ success: false, message: "blog not found!" });
    }
    const removeblog = await BLOG.findOneAndDelete(blogId);
    if (!removeblog) {
      return res
        .status(401)
        .json({ success: false, message: "not remove product" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "BLOG REMOVED SUCCESFULLY !",
        removeblog,
      });
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
