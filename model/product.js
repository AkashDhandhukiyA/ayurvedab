const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Ayurvedic", "Cosmetic", "Food", "Herbal", "Other"], // ✅ Correct enum
    },
    brand: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },
    discount: {
      max:100,
      type: Number,
      default: 0,
    },
  

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
    },
    instock: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // ✅ correct spelling
);

module.exports = mongoose.model("PRODUCT", ProductSchema);
