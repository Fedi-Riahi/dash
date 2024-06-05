import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  phone: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  address: {
    type: String,
  },

  // Other user fields
}, {timestamps: true});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
