const User = require("../models/user");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var jwtExpress = require('express-jwt');
 
exports.signup = (req, res) => {
	//express validators
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  return res.status(422).json({ error: errors.array()[0].msg });
	}
  
	const user = new User(req.body);
	user.save((err, user) => {
		if (err) {
			return res.status(400).json({
				err: "Not able to save user in DB"
			});
		}
		res.json({
			name: user.name,
			email: user.email,
			id:user._id
		});
	});
};

exports.signin = async (req, res) => {
	const errors = validationResult(req);
	const { email, password } = req.body;

	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array()[0].msg });
	}

	try {
		const user = await User.findOne(email);
	console.log("11111111");
		if (!user) {
			return res.status(400).json({
				error: "User email does not exist"
			});
		}
		
		const isVerify = user.authenticate(password);
		console.log({ isVerify });
		if (!isVerify) {
		return res.status(401).json({
			errors: "Email and Password do not match."
		});
	}
	//create token
	const token = jwt.sign({ _id: user._id }, process.env.SECRET);
	//put token in cookie
	res.cookie("token", token, { expire: new Date() + 364 });

	//send response to front end
	const { _id, name, email, role } = user;
	return res.json({
		token, user: { _id, name, email, role }
	});
   } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


exports.signout = (req, res) => {
	res.clearCookie("token");	
	res.json({
		massage: "User signout successfully"
	});
};

//protected route
exports.isSignedIn = jwtExpress({
	secret: process.env.SECRET,
    userProperty: "auth"
});

exports.isAuthenticated = (req, res, next) => {
	let checker = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!checker) {
		return res.status(403).json({
			error: "ACCESS DENIED"
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: "You are not an ADMIN, Access Denied"
		});
	}
	next();
};