const express = require("express");
const bcryptjs = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const User = require("../../models/User");
const auth = require("../../middleware/auth");

router.get("/", [auth], async (req, res) => {
  try {
    const users = await User.find()
      .select(["-password", "-__v"])
      .sort({ dateCreated: -1 });
    return res.status(200).json(users);
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
      check("name", "Name is missing!").notEmpty(),
      check("email", "Provide a valid email address!").isEmail(),
      check(
        "password",
        "Provide atleast a six character long password!"
      ).isLength({ min: 6 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    let { email, name, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ error: "User already exists" }] });
      }

      const salt = await bcryptjs.genSalt(10);

      password = await bcryptjs.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password,
        createdBy: req.user.name,
        creatorEmail: req.user.email,
      });

      await newUser.save();
      res.status(200).json({ sucess: `User ${name} created successfully!` });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error!" });
    }
  }
);

router.put(
  "/",
  [auth, [check("email", "Email is required!").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { email, name } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        user.name = name;
        user.modifiedBy = req.user.name;
        user.modifierEmail = req.user.email;
        user.dateModified = Date();
        await user.save();
        return res
          .status(200)
          .json({ success: "User details updated successfully!" });
      } else {
        return res
          .status(404)
          .json({ error: `User with email ${email} does not exist!` });
      }
    } catch (error) {
      console.error("Error while updating!");
      res.status(500).json({ error: "Server error!" });
    }
  }
);

module.exports = router;
