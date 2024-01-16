const express = require("express");

const router = express.Router();

const { resolveError } = require("../public/javascripts/error");

const isAuth = require("../middleware/isAuth");
const multer = require("multer");

const Slider = require("../infrastructure/models/sliders");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = "./public/images";

        cb(null, path);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.originalname.split(".").pop());
    }
});

const upload = multer({ storage: storage });

router.get("/adminPanel/", isAuth, async (req, res, next) => {
    try {
        let sliderList = await Slider.find();
        res.status(200).json({ sliderList });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("/adminPanel/:id", isAuth, async (req, res, next) => {
    const { id } = req.params;
    try {
        let slider = await Slider.findById(id);
        res.status(200).json({ slider });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/update/:id", isAuth, async (req, res, next) => {
    const { id } = req.params;
    try {
        console.log(req.body);
        await Slider.findByIdAndUpdate(id, req.body);

        res.status(200).json({ message: "slider updated" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.delete("/adminPanel/delete/:id", isAuth, async (req, res, next) => {
    const { id } = req.params;
    try {
        await Slider.findByIdAndRemove(id);

        res.status(200).json({ message: "slider deleted" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/create", isAuth, upload.single("picture"), async (req, res, next) => {
    try {
        let slider = await Slider.create(req.body);

        if (req.file) {
            console.log(req.file);
            slider.picture = req.file.filename;
        }

        await slider.save();

        res.status(200).json({ message: "slider created" });
    } catch (error) {
        resolveError(error, res);
    }
});

module.exports = router;
