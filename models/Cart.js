const mongoose = require("mongoose");
const Joi = require("joi");
const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    products: [
      {
        id: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        category: {
          type: String,
        },
        discount: {
          type: Number,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

function validateCart(obj) {
  const schema = Joi.object({
    products: Joi.array().items(
      Joi.object({
        id: Joi.number().required(),
        quantity: Joi.number().integer().min(1),
        title: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        discount: Joi.number(),
        image: Joi.string().required(),
      }),
    ),
    totalPrice: Joi.number(),
  });
  return schema.validate(obj);
}
const Cart = mongoose.model("Cart", CartSchema);
module.exports = { Cart, validateCart };
