const express = require("express");

const router = express.Router();

let multer = require("multer");
const path = require("path");

const isAuth = require("../middleware/isAuth");
const { resolveError } = require("../public/javascripts/error");

const SmsApi = require("../infrastructure/models/smsApi");

router.get("/adminPanel", isAuth, async (req, res, next) => {
    try {
        let smsApiList = await SmsApi.find();
        res.status(200).json({ smsApiList });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("/adminPanel/:id", isAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        let smsApi = await SmsApi.findById(id);
        res.status(200).json({ smsApi });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/create", isAuth, async (req, res, next) => {
    try {
        const newSmsApi = new SmsApi({
            ...req.body
        });

        await newSmsApi.save();

        res.status(200).json({ message: "smsApi created" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/update/:id", isAuth, async (req, res, next) => {
    try {
        await SmsApi.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ message: "smsApi updated" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.delete("/adminPanel/delete/:id", isAuth, async (req, res, next) => {
    try {
        await SmsApi.findByIdAndRemove(req.params.id);

        res.status(200).json({ message: "smsApi deleted" });
    } catch (error) {
        resolveError(error, res);
    }
});

module.exports = router;
