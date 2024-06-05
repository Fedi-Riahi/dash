import mongoose from "mongoose";


// Define the order schema
const orderSchema = new mongoose.Schema(
  {
    userId: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    code: { type: String, required: true },
    items: [
      {
        itemId: { type: String, required: true },
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },  
      },
    ],
    totalPrice: { type: Number, required: true },
    state: { type: String },
    city: { type: String },
    address: { type: String },
    zipCode: { type: String },
    cardNumber: { type: String }, // Card number
    paymentMethod: { type: String }, // Payment method (e.g., card, cash on delivery, etc.)
    ccv: { type: String }, // Card verification value (CCV)
    expiryDate: { type: String }, // Expiry date of the card
    status: {
      type: String,
      enum: ["pending", "declined", "confirmed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Create the Order model
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
