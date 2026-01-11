const BLOG = require("../model/blog");
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
exports.getBlogservices = async (req, res, next) => {
  try {
    const BlogData = await BLOG.find();
    res
      .status(200)
      .json({ success: true, massage: "data send succefully ", BlogData });
  } catch (error) {
    res.json({ error: error });
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
    res
      .status(200)
      .json({ success: true, massage: "LATE SEE!",  blog });
  } catch (error) {
    res.json({error:error})
  }
};
