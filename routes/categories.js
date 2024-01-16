const express = require("express");

const router = express.Router();

let multer = require("multer");
const path = require("path");

const isAuth = require("../middleware/isAuth");
const Category = require("../infrastructure/models/categories");
const { resolveError } = require("../public/javascripts/error");

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

const upload = multer({ storage: storage, limits: { fieldSize: 20971520 } });

router.get("/adminPanel", isAuth, async (req, res, next) => {
    try {
        let categoryList = await Category.find();
        res.status(200).json({ categoryList });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("/adminPanel/:id", isAuth, async (req, res, next) => {
    const { id } = req.params;
    try {
        let category = await Category.findById(id);
        res.status(200).json({ category });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/create", isAuth, upload.fields([{ name: "categoryImages", maxCount: Infinity }]), async (req, res, next) => {
    try {
        const newCategory = new Category({
            ...req.body,
            images: req.files.categoryImages.map((image) => image.filename)
        });

        await newCategory.save();

        res.status(200).json({ message: "category created" });
    } catch (error) {
        resolveError(error, res);
    }
});

module.exports = router;
