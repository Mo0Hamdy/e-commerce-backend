const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyTokens");
const asyncHandler = require("express-async-handler");
const { Cart, validateCart } = require("../models/Cart");

/**
 * @des Get Cart Products
 * @route api/cart
 * @method GET
 * @access private
 */

router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate("user", [
      "_id",
      "firstName",
      "lastName",
      "email",
    ]);
    res.status(200).json(cart);
  }),
);

/**
 * @desc Post New Cart
 * @route api/cart
 * @method POST
 * @access private
 */

router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { error } = validateCart(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      //no cart exists for current user --> we will create one
      cart = new Cart({
        user: req.user.id,
        products: req.body.products,
      });
      const result = await cart.save();
      return res.status(201).json(result);
    }
    // there exist a cart for current user --> we update some fields
    let exist = false;
    cart.products.forEach((element) => {
      if (element.id === req.body.products[0].id) {
        element.quantity += req.body.products[0].quantity || 1;
        exist = true;
      }
    });
    if (!exist) {
      const newProduct = {
        id: req.body.products[0].id,
        title: req.body.products[0].title,
        price: req.body.products[0].price,
        category: req.body.products[0].category,
        discount: req.body.products[0].discount,
        image: req.body.products[0].image,
        quantity: req.body.products[0].quantity || 1,
      };
      cart.products.push(newProduct);
    }
    const result = await cart.save();
    res.status(200).json(result);
  }),
);

/**
 * @desc Update Quantity
 * @route api/cart/:id
 * @method Patch
 * @access private
 */

router.patch(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      const product = cart.products.find(
        (element) => element.id == req.body.id,
      );
      if (product) {
        product.quantity += req.body.amount;
        await cart.save();
      }
      res.status(200).json(cart.products);
    } else {
      res.status(404).json("no cart found");
    }
  }),
);

module.exports = router;
