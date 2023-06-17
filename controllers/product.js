const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");


exports.getProductById = (req, res, next, id) => {
	Product.findById(id)
		.populate("category")
		.exec((err, product) => {
		if (err) {
			return res.status(400).json({
				error: "Product was not found in DB"
			});
		}
		req.product = product;
		next();
	});
}


exports.createProduct = (req, res) => {
	let form = formidable.IncomingForm();
	form.keepExtensions = true;	

	form.parse(req, (err, fields, file) => {
		if (err) {
			return res.status(400).json({
				error: "some problem with file"
			});
		}

		//Destructure the fields

		const { name, description, price, category, stock } = fields;
		if ( !name || !description || !price || !category || !stock) {
			return res.status(400).json({
				error: "Please include all fields"
			});
		}

		let product = new Product(fields);

		//handle fils
		if (file.photo) {
			if (file.photo.size > 3000000) {
				return res.status(400).json({
					error: "File size is to big!"
				});
			}
			product.photo.data = fs.readFileSync(file.photo.path)
			product.photo.contentType = file.photo.type
			
		}
		// console.log(product);

		product.save((err, product) => {
			if (err) {
				return res.status(400).json({
					error: "Saving Product in DB is failed"
				});
			}
			res.json(product);
		});
	});
}


exports.getProduct = (req, res) => {
	req.product.photo = undefined;
	return res.json(req.product);
}

exports.photo = (req, res) => {
	if (req.product.photo.data) {
		res.set("Content-Type", req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
}

exports.removeProduct = (req, res) => {
	let product = req.product;
	product.remove((err, removedProduct) => {
		if (err) {
			return res.status(400).json({
				error: "Failed to delete this product"
			});
		}
		res.json({
			message: `${product.name} deletion was a successfully`,
			removedProduct
		});
	});
}

exports.updateProduct = (req, res) => {
	let form = formidable.IncomingForm();
	form.keepExtensions = true;	

	form.parse(req, (err, fields, file) => {
		if (err) {
			return res.status(400).json({
				error: "some problem with file"
			});
		}

		let product = req.product;
		product = _.extend(product, fields); 

		//handle fils
		if (file.photo) {
			if (file.photo.size > 3000000) {
				return res.status(400).json({
					error: "File size is to big!"
				});
			}
			product.photo.data = fs.readFileSync(file.photo.path)
			product.photo.contentType = file.photo.type
			
		}
		// console.log(product);

		product.save((err, product) => {
			if (err) {
				return res.status(400).json({
					error: "update's of product is failed"
				});
			}
			res.json(product);
		});
	});
}

exports.getAllProduct = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 8
	let sortBy = req.query.sortBy ?  req.query.sortBy : "_id"
	Product.find()
		.select("-photo")
		.populate("category")
		.sort([[sortBy, "ascrassing"]])
		.limil(limit)
		.exec((err, products) => {
		if (err) {
			return res.status(400).json({
				error: "Products was not Found"
			});
		}
		res.json(products)
	});
}

exports.getAllUniqueCategory = (req, res) => {
	Product.distinct("category", {}, (err, category) => {
		if (err) {
			return res.status(400).json({
				error: "No category Found"
			});
		}
		res.json(category);
	});
}	

exports.updateStock = (req, res) => {
	let myOperation = req.body.order.products.myOperation(product => {
		return {
			updateOne: {
				filter: { _id: product._id },
				update: { $inc: { stock: -product.count, sold: +product.count } }
			}
		}
	});

	Product.bulkWrite(myOperation, {}, (err, procut) => {
		if (err) {
			return res.status(400).json({
				error: "Bulk operation failed"
			});
		}
	});
}
