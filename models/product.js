const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const productSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		require: true,
		maxlangth: 50,
	},
	description: {
		type: String,
		trim: true,
		require: true,
		maxlangth: 2500,
	},
	price: {
		type: Number,
		require: true,
		maxlangth: 32,
		trim: true,
	},
	category: {
		type: ObjectId,
		ref: 'Category',
		require: true,
	},
	stock: {
		type: Number,
	},
	sold: {
		type: Number,
		default: 0,
	},
	photo: {
		data: Buffer,
		ContentType: String,
	},
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
