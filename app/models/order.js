const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
    {
        customerId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: { type: Object, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        paymentType: { type: String, default: "COD" },
        status: { type: String, default: "order_place" }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
