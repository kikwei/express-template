const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  creatorEmail: {
    type: String,
  },
  dateModified: {
    type: Date,
  },
  modifiedBy: {
    type: String,
  },
  modifierEmail: {
    type: String,
  },
});

module.exports = mongoose.model("product", ProductSchema);
