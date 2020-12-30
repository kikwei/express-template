const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Product = require("../../models/Product");

router.get("/", [auth], async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ dateCreated: -1 })
      .select(["-__v"]);
    return res.status(200).json(products);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error!" });
  }
});

router.post(
  "/",
  [
    auth,
    [
      check(["productName", "unitPrice"], "Required field is missing!")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { productName, unitPrice } = req.body;
    const { email, name } = req.user;

    try {
      const newProduct = new Product({
        productName,
        unitPrice,
        createdBy: name,
        creatorEmail: email,
      });

      newProduct.save();
      res.json({
        success: `Product ${productName} created successfully!`,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Server error");
    }
  }
);

router.put("/:id", [auth], async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product does not exist!" });
  }

  try {
    product.productName = req.body.productName || product.productName;
    product.unitPrice = req.body.unitPrice || product.unitPrice;
    product.modifiedBy = req.user.name;
    product.modifierEmail = req.user.email;
    product.dateModified = Date();

    await product.save();

    return res
      .status(200)
      .json({ success: "Product details updated successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Server error!" });
  }
});

module.exports = router;
