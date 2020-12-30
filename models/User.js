const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
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

module.exports = mongoose.model("user", UserSchema);
