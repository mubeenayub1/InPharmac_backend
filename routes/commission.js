const express = require("express");

const router = express.Router();

const { resolveError } = require("../public/javascripts/error");

const isAuth = require("../middleware/isAuth");

const Commission = require("../infrastructure/models/commission");

router.get("/adminPanel/pickups", isAuth, async (req, res, next) => {
    try {
        let commissionList = await Commission.find({ orderMethod: "pickup" });
        res.status(200).json({ commissionList });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("/adminPanel/deliveries", isAuth, async (req, res, next) => {
    try {
        let commissionList = await Commission.find({ orderMethod: "delivery" });
        res.status(200).json({ commissionList });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("/adminPanel/:id", isAuth, async (req, res, next) => {
    try {
        let prescription = await Commission.findById(req.params.id);
        res.status(200).json({ prescription });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/update/:id", isAuth, async (req, res, next) => {
    try {
        let { id } = req.params;
        let commission = await Commission.findByIdAndUpdate(id, req.body);

        res.status(200).json({ message: "commission updated" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.delete("/adminPanel/delete/:id", isAuth, async (req, res, next) => {
    try {
        let { id } = req.params;
        await Commission.findByIdAndRemove(id);

        res.status(200).json({ message: "commission deleted" });
    } catch (error) {
        resolveError(error, res);
    }
});



module.exports = router;