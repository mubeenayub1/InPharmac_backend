const express = require("express");

const router = express.Router();

const { resolveError } = require("../public/javascripts/error");

const isAuth = require("../middleware/isAuth");

const City = require("../infrastructure/models/cities");

router.get("/adminPanel", isAuth, async (req, res, next) => {
    try {
        let cityList = await City.find();

        res.status(200).json({ cityList });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("/adminPanel/:id", isAuth, async (req, res, next) => {
    try {
        const city = await City.findById(req.params.id);

        res.status(200).json({ city });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/create", isAuth, async (req, res, next) => {
    try {
        const city = new City(req.body);
        console.log(req.body)

        await city.save();

        res.status(201).json({ city });
    } catch (err) {
        resolveError(err, res);
    }
});

router.put("/adminPanel/:id", isAuth, async (req, res, next) => {
    try {
        const city = await City.findById(req.params.id);

        if (!city) return res.status(404).json({ message: "City not found" });

        city.set(req.body);

        await city.save();

        res.status(200).json({ city });
    } catch (err) {
        resolveError(err, res);
    }
});

router.delete("/adminPanel/delete/:id", isAuth, async (req, res, next) => {
    try {
        await City.findByIdAndRemove(req.params.id);

        res.status(200).json({ message: "City deleted" });
    } catch (error) {
        resolveError(error, res);
    }
});

module.exports = router;
