const express = require("express");

const router = express.Router();

const { resolveError } = require("../public/javascripts/error");

const isAuth = require("../middleware/isAuth");

const Pharmacy = require("../infrastructure/models/pharmacy");
const User = require("../infrastructure/models/user");
const Order = require("../infrastructure/models/orders");
const Staff = require("../infrastructure/models/staff");

router.get("/adminPanel", isAuth, async (req, res, next) => {
    try {
        // count pharmacy instance in database

        const pharmaciesCount = await Pharmacy.countDocuments({});
        const usersCount = await User.countDocuments({});
        const ordersCount = await Order.countDocuments({});
        const pendingOrdersCount = await Order.countDocuments({ status: "pending" });
        const pendingSellers = await Pharmacy.countDocuments({ status: "pending" });
        const staffCount = await Staff.countDocuments({});
        const newUserCount = await User.countDocuments({ newUser: true });

        const pharmacyList = await Pharmacy.find();
        const orderList = await Order.find();

        res.status(200).json({ pharmaciesCount, usersCount, ordersCount, earnings: "200", pendingOrdersCount, pendingSellers, staffCount, newUserCount, pharmacyList, orderList });
    } catch (error) {
        resolveError(error, res);
    }
});

module.exports = router;
