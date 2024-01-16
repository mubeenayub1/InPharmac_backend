const express = require("express");

const router = express.Router();

let multer = require("multer");
const path = require("path");

const isAuth = require("../middleware/isAuth");
const { resolveError } = require("../public/javascripts/error");
const Support = require("../infrastructure/models/support");

router.get("/adminPanel", isAuth, async (req, res, next) => {
    try {
        let supportList = await Support.find();
        res.status(200).json({ supportList });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("/adminPanel/:id", isAuth, async (req, res, next) => {
    const { id } = req.params;
    try {
        let support = await Support.findById(id);
        res.status(200).json({ support });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/create", isAuth, async (req, res, next) => {
    try {
        const newSupport = new Support({
            ...req.body
        });

        await newSupport.save();

        res.status(200).json({ message: "support created" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/update/:id", isAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        await Support.findByIdAndUpdate(id, req.body);
    } catch (err) {
        resolveError(err, res);
    }
});

router.delete("/adminPanel/delete/:id", isAuth, async (req, res, next) => {
    const { id } = req.params;
    try {
        await Support.findByIdAndRemove(id);

        res.status(200).json({ message: "support deleted" });
    } catch (err) {
        resolveError(err, res);
    }
})

module.exports = router;
