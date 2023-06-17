const express = require("express");
const router = express.Router();

const { createProduct,
	getProductById,
	getProduct,
	photo,
	removeProduct,
	updateProduct,
	getAllProduct,
	getAllUniqueCategory
} = require("../controllers/product");
const { isAuthenticated, isAdmin, isSignedIn } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//all of param
router.param("userID", getUserById);
router.param("productID", getProductById);

//all actual routes

//create route
router.post("/product/create/:userID", isSignedIn, isAuthenticated, isAdmin,  createProduct);

//read route
router.get("/product/:productID", getProduct);
router.get("/product/photo/:productID", photo);

//delete route 
router.delete("/product/:productID/:userID", isSignedIn, isAuthenticated, isAdmin, removeProduct);

//update route 
router.put("/product/:productID/:userID", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//listing route
router.get("/products", getAllProduct);
router.get("/products/categories", getAllUniqueCategory);


module.exports = router;