const express = require("express");

const router = express.Router();

const { resolveError } = require("../public/javascripts/error");

const isAuth = require("../middleware/isAuth");

const Staff = require("../infrastructure/models/staff");

router.get("/adminPanel/", isAuth, async (req, res, next) => {
    try {
        let StaffList = await Staff.find();
        res.status(200).json({ StaffList });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("/adminPanel/:id", isAuth, async (req, res, next) => {
    const { id } = req.params;
    try {
        let Staff = await Staff.findById(id);
        res.status(200).json({ Staff });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/create", isAuth, async (req, res, next) => {
    try {
        const newStaff = new Staff({
            ...req.body
        });

        await newStaff.save();

        res.status(200).json({ message: "Staff created" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/update/:id", isAuth, async (req, res, next) => {
    try {
        const { id } = req.params;

        await Staff.findByIdAndUpdate(id, req.body);

        res.status(200).json({ message: "Staff updated" });
    } catch (err) {
        resolveError(err, res);
    }
});

router.delete("/adminPanel/delete/:id", isAuth, async (req, res, next) => {
    const { id } = req.params;
    try {
        await Staff.findByIdAndRemove(id);

        res.status(200).json({ message: "Staff deleted" });
    } catch (error) {
        resolveError(error, res);
    }
});

module.exports = router;