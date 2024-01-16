const express = require("express");

const router = express.Router();

const { resolveError } = require("../public/javascripts/error");

const isAuth = require("../middleware/isAuth");

const FAQs = require("../infrastructure/models/FAQs");


router.post("/create", async (req, res, next) => {
    try {
        const FAQ = new FAQs(req.body);

        await FAQ.save();

        res.status(200).json({ message: "FAQ created" });
    } catch (error) {
        resolveError(error, res);
    }
});
router.get("/getAll", async (req, res, next) => {
    try {
        const FAQ =await FAQs.find();

        

        res.status(200).json({ status: "success",data:FAQ });
    } catch (error) {
        resolveError(error, res);
    }
});
module.exports = router;