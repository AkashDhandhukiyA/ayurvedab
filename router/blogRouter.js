const express = require("express");
const BlogRouter = express.Router();
const blogController = require("../controller/blogcontroller");

// BlogRouter.post("/blog", blogController.postAddToBlog);
BlogRouter.get("/blog",blogController.getBlogservices);
BlogRouter.get("/blog/:id",blogController.getviewsblog);
module.exports = BlogRouter;
