const express = require("express");

const router = express.Router();
const Admin = require("../infrastructure/models/admin");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { resolveError } = require("../public/javascripts/error");

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email: email });
        if (admin == null) return res.status(200).json({ message: "User with this email does not exist" ,status:false});
        if(admin?.password !== password){
            return res.json({status: 404, message: "invalid Password"})
        }

        const token = jwt.sign(
            {
                email: admin.email,
                userId: admin._id.toString()
            },
            "somesecretsecret",
            { expiresIn: "24h" }
        );

        res.status(200).json({ token: token,status:true });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email: email });
        if (admin != null) return res.status(404).json({ message: "admin with this email already exist" });

        const newAdmin = new Admin(req.body);

        await newAdmin.save();

        res.status(201).json({ message: "admin created" });
    } catch (error) {
        resolveError(error, res);
    }
});

module.exports = router;
