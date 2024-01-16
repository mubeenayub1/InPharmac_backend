const express = require("express");

const router = express.Router();

const { resolveError } = require("../public/javascripts/error");

const isAuth = require("../middleware/isAuth");

const ContactUs = require("../infrastructure/models/contactUs");


router.post("/create", async (req, res, next) => {
    try {
        const contactUs = new ContactUs(req.body);

        await contactUs.save();

        res.status(200).json({ message: "contactUs created" });
    } catch (error) {
        resolveError(error, res);
    }
});