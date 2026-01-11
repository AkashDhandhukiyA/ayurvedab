const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
 
  blogcontain: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
   image: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("BLOG", blogSchema);
