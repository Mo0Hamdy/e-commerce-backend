const mongoose = require("mongoose");
const Joi = require("joi");
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

function validateProduct(obj) {
  const schema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string(),
    category: Joi.string().required(),
    discount: Joi.number(),
    stock: Joi.number().required(),
    image: Joi.string().required(),
  });
  return schema.validate(obj);
}

const Product = mongoose.model("Product", ProductSchema);
module.exports = { Product, validateProduct };
