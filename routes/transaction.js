const express = require("express");

const router = express.Router();

const { resolveError } = require("../public/javascripts/error");

const isAuth = require("../middleware/isAuth");

const Transaction = require("../infrastructure/models/transaction");

router.get("/adminPanel", async (req, res, next) => {
    try {
        let transaction = await Transaction.find();

        res.status(200).json({ transaction });
    } catch (err) {
        resolveError(err, res);
    }
});

router.get("/adminPanel/:id", async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        res.status(200).json({ transaction });
    } catch (err) {
        resolveError(err, res);
    }
});

router.post("/adminPanel/create", async (req, res, next) => {
    try {
        const transaction = new Transaction({
            ...req.body
        });

        await transaction.save();

        res.status(201).json({ transaction });
    } catch (err) {
        resolveError(err, res);
    }
});

router.put("/adminPanel/:id", async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if(!transaction) return res.status(404).json({ message: "Transaction not found" });

        transaction.set(req.body);

        await transaction.save();

        res.status(200).json({ transaction });
    } catch (err) {
        resolveError(err, res);
    }
});

router.delete("/adminPanel/:id", async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if(!transaction) return res.status(404).json({ message: "Transaction not found" });

        await transaction.remove();

        res.status(200).json({ message: "Transaction deleted" });
    } catch (err) {
        resolveError(err, res);
    }
});

module.exports = router;