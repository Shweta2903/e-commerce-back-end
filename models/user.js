const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

	const userSchema = new mongoose.Schema({
		name: {
			type: String,
			require: true,
			trim: true,
			maxlength: 15,
		},
		lastname: {
			type: String,
			trim: true,
			maxlength: 30,
		},
		userinfo: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			require: true,
			unique: true,
		},
		encry_password: {
			type: String,

		},
		salt: String,
		role: {
			type: Number,
			default: 0,
		},
		purchases: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true },
);

userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  authenticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function(plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);
	