const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');


const {signout, signup, signin, isSignedIn} = require("../controllers/auth")

router.post("/signup", [
	check("name").isLength({min: 5}).withMessage("name must be at least 5 char long"),
check("password").isLength({min: 3}).withMessage("Password in not valid"),
check("email").isEmail().withMessage("email is required")
], signup);

router.get("/signout", signout);

//signin route
router.post(
	"/signin",
	[
	check("email", "email must required").isEmail(),
	check("password", "Password must contain 3 char").isLength({ min: 3 })
	],
	signin
);

router.get("/testroute", isSignedIn, (req, res) => {
	res.json(req.auth);
} );

module.exports = router;

