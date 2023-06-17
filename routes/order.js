const express = require("express");
const router = express.Router();

const { isAuthenticated, isAdmin, isSignedIn } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const { getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus } = require("../controllers/order");
 
//params
router.param("userID", getUserById);
router.param("orderID", getOrderById);

//Actual Route
//crete route
router.post("/order/create/:userID",
	isSignedIn,
	isAuthenticated,
	pushOrderInPurchaseList,
	updateStock,
	createOrder);

//read route
router.get("/order/all/:userID",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getAllOrders);

//Status of order
router.get("/order/status/:userID",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getOrderStatus
);

router.put("/order/:userID/status/:orderID",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateStatus
);

module.exports = router;