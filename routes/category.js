const express = require("express");
const router = express.Router();

const { getCategoryById,
	createCategory,
	getCategory,
	getAllCategory,
	updateCategory,
	removeCategory
} = require("../controllers/category");
const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

//parameters
router.param("userID", getUserById);
router.param("categoryID", getCategoryById);

//actual routes

//Create
router.post("/category/create/:userID", isSignedIn, isAuthenticated, isAdmin, createCategory);

//read
router.get("/category/:categoryID", getCategory);
router.get("/categories/:categoryID", getAllCategory);

//update
router.put("/category/:userID/:categoryID", isSignedIn, isAuthenticated, isAdmin, updateCategory);

//delete
router.delete("/category/:userID/:categoryID", isSignedIn, isAuthenticated, isAdmin, removeCategory);

module.exports = router;
