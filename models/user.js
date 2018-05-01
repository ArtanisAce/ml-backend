const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  }
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
