const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { Product, validateProduct } = require("../models/Product");
const verifyTokens = require("../middlewares/verifyTokens");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const product = await Product.findOne({ title: req.body.title })
    if (!product) {
      const product = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        discount: req.body.discount,
        image: req.body.image,
        stock: req.body.stock,
        category: req.body.category,
      });
      const result = await product.save()
      res.status(201).json(result)
    }
      return res.status(400).json({message:"product already exists"})
  }),
);

module.exports = router;
