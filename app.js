var createError = require("http-errors");
var cors = require("cors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const dashboardRoutes = require("./routes/dashboard");
const adminRoutes = require("./routes/admin");
const pharmacyRoutes = require("./routes/pharmacy");
const userRoutes = require("./routes/user");
const commissionRoutes = require("./routes/commission");
const staffRoutes = require("./routes/staff");
const slidersRoutes = require("./routes/sliders");
const categoriesRoutes = require("./routes/categories");
const orderRoutes = require("./routes/order");
const pharmactOrderRoutes = require("./routes/pharmacyOrder");
const transactionRoutes = require("./routes/transaction");  
const supportRoutes = require("./routes/support");
const smsApiRoutes = require("./routes/smsApi");
const cityRoutes = require("./routes/city");
const FAQRoutes=require("./routes/FAQs");
const RiderRoutes = require("./routes/rider")

var app = express();
app.use(cors());


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));




app.use("/admin", adminRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/pharmacy", pharmacyRoutes);
app.use("/user", userRoutes);
app.use("/commission", commissionRoutes);
app.use("/staff", staffRoutes);
app.use("/sliders", slidersRoutes);
app.use("/categories", categoriesRoutes);
app.use("/order", orderRoutes);
app.use("/pharmacyOrder", pharmactOrderRoutes);
app.use("/transaction", transactionRoutes);
app.use("/support", supportRoutes);
app.use("/smsApi", smsApiRoutes);
app.use("/city", cityRoutes);
app.use("/faq", FAQRoutes);
app.use("/rider", RiderRoutes);

app.get("/", (req, res, next) => {
    res.send("hello");
});

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
