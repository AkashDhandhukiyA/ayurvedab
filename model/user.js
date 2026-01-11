const mongoose = require("mongoose");

const userinfoSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true ,enum:["User","Admin"]},
  favorite: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PRODUCT",
    },
  ],
  bag: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PRODUCT",
    },
  ],
});

module.exports = mongoose.model("USER", userinfoSchema);
