const mongoose = require("mongoose");
const { Schema } = mongoose;

const menuSchema = new Schema({
  name: { type: String, require: true },

  image: { type: String, require: true },

  price: { type: Number, require: true },

  size: { type: String, require: true },
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
