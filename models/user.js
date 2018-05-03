const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// Hashing password before saving it to the database
UserSchema.pre("save", next => {
  const user = this;
  if (Object.keys(user).length > 0) {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
