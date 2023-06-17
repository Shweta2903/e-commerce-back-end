require('dotenv').config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//my routes 
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");



const app = express();

// DB connection
mongoose.connect(process.env.DATABASE, {
	useFindAndModify: true,
	useUnifiedTopology: true,
	useNewUrlParser: true,
}).then(() => {
	console.log("DB CONNECTED")
});

//all three middleware 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//my routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

//port 
const port = process.env.PORT || 5000;
 
//Starting of server 
app.listen(port, () => {
	console.log(`Hello World`);
}); 
