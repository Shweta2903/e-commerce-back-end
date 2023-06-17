const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema({
	product: {
		type: ObjectId,
		ref: "Product",
	},
	name: String,
	count: Number,
	price: Number,
});

const CartItem = mongoose.model("CartItem", CartItemSchema);

const orderSchema = new mongoose.Schema({
	product: [CartItemSchema],
	transaction: {},
	amount: { type: Number },
	address: String,
	status: {
		type: String,
		default: "Received",
		enum : ["Cancelled", "Delivered", "Shipped", "Processing", "Received"]
	},
	update: Date,
	user: {
		type: ObjectId,
		ref: "User",
	},
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema)

module.exports = { Order, CartItem };