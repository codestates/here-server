var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const restaurantRouter = require("./routes/restaurant");

const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Must use this when it is production
app.use(
	cors({
		origin: [
			"http://ygm-here.s3-website.ap-northeast-2.amazonaws.com",
			"http://18.223.115.35",
			"http://localhost",
			"https://here.soltylink.com",
			"http://soltylink.com",
		],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	}),
);

app.use(
	session({
		secret: process.env.JWT_PUBLIC,
		resave: false,
		saveUninitialized: true,
	}),
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// TODO: handle cors
app.use(cors());
app.use("/restaurant", restaurantRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
