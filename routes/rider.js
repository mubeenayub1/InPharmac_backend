const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const router = express.Router();
const Rider = require("../infrastructure/models/rider");
const OTPModal = require("../infrastructure/models/OTPVerification");
let multer = require("multer");
var nodemailer = require("nodemailer");
const textflow = require("textflow.js");
const { auth } = require("../firebase.config");
const { RecaptchaVerifier } = require("firebase/auth");
textflow.useKey("yRalmQHO1W8eOh7v5f8Z8YuWhOVXjMHr5rYwYAqf7ta1WuQkPeOEUe1lJByjKDZ3");

const { resolveError } = require("../public/javascripts/error");

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("updateLocation", async (locationData) => {
        const { riderId, latitude, longitude } = locationData;
        await Rider.findByIdAndUpdate(riderId, { latitude, longitude });

        socket.broadcast.emit("riderLocationUpdate", { riderId, latitude, longitude });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = "./public/images";
        cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fieldSize: 20971520 }
});

const jwt = require("jsonwebtoken");
const isAuth = require("../middleware/isAuth");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "irfanulhaq228@gmail.com",
        pass: "ugrz hboo xlvy vlpr"
    }
});

const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

transporter.verify((error, success) => {
    if (error) {
        console.log("not ready for message");
        console.log(error);
    } else {
        console.log("Ready for Mail Message");
    }
});

const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
                size: "invisible",
                callback: (response) => {},
                "expired-callback": () => {}
            },
            auth
        );
    }
};

router.post("/send_otp", async (req, res) => {
    try {
        const { email, phone_number } = req.body;
        let rider = await Rider.findOne({ email: email });
        if (rider !== null) {
            return res.json({ status: 404, message: "Email already Exists" });
        }
        let riderPh = await Rider.findOne({ phone_number: phone_number });
        if (riderPh !== null) {
            return res.json({ status: 404, message: "Phone Number already Exists" });
        }
        const verificationCode = generateVerificationCode();
        // const result = await textflow.sendVerificationSMS(phone_number);
        // console.log(result);
        const mailOptions = {
            from: "irfanulhaq228@gmail.com",
            to: email,
            subject: "Email Verification",
            html: `<h2>Verification Code</h2><p>Hi, Your Verification code is:</p><p><b>${verificationCode}</b></p>`
        };
        await transporter.sendMail(mailOptions);
        const data = await new OTPModal({ email, OTP: verificationCode, phone_number });
        data.save();
        return res.json({ status: 200, message: "OTP Send to Phone Number and Email" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/verify_otp", async (req, res, next) => {
    try {
        const { email, phone_number, otp } = req.body;
        const findOTP = await OTPModal.find({ email });
        const array = [];
        findOTP?.map((item) => {
            if (item?.OTP === otp) {
                array.push(item);
            }
        });
        if (array?.length === 0) {
            return res.json({ status: 404, message: "Wrong OTP" });
        } else {
            await OTPModal.deleteMany({ email });
            return res.json({ status: 200, message: "Email Verified Successfully" });
        }
    } catch (error) {
        resolveError(error, res);
    }
});

router.post(
    "/register",
    upload.fields([
        { name: "cnic_front", maxCount: 1 },
        { name: "cnic_back", maxCount: 1 },
        { name: "license_image", maxCount: 1 },
        { name: "selfie", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const { email, phone_number, latitude, longitude } = req.body;
            console.log("latitude", latitude);
            console.log("longitude", longitude);
            if (req.files.cnic_front) {
                req.body.cnic_front = req.files.cnic_front[0].originalname;
            }
            if (req.files.cnic_back) {
                req.body.cnic_back = req.files.cnic_back[0].originalname;
            }
            if (req.files.license_image) {
                req.body.license_image = req.files.license_image[0].originalname;
            }
            if (req.files.selfie) {
                req.body.selfie = req.files.selfie[0].originalname;
            }
            let rider = await Rider.findOne({ $or: [{ email: email }, { phone_number: phone_number }] });

            if (rider !== null) {
                return res.json({ status: 200, message: "Rider already Exists" });
            }
            const location = {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            };
            req.body.location = location;
            rider = new Rider(req.body);
            await rider.save();
            const token = jwt.sign(
                {
                    riderId: rider._id.toString()
                },
                "somesecretsecret",
                { expiresIn: "30d" }
            );
            res.status(200).json({ token: token, message: "Rider created", status: 200, data: rider });
        } catch (error) {
            console.log(error);
            resolveError(error, res);
        }
    }
);

router.post("/update-location", async (req, res) => {
    try {
        const { id, latitude, longitude } = req.body;
        await Rider.findByIdAndUpdate(id, { latitude, longitude });
        res.status(200).json({ message: "Location updated successfully" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/registerpractice", async (req, res) => {
    try {
        const { email, phone_number } = req.body;
        let rider = await Rider.findOne({ $or: [{ email: email }, { phone_number: phone_number }] });
        if (rider !== null) {
            return res.json({ status: 404, message: "Rider already Exists" });
        }
        rider = new Rider(req.body);
        await rider.save();
        res.status(200).json({ message: "Rider created", status: 200 });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password, latitude, longitude } = req.body;
        console.log("latitude", latitude);
        console.log("longitude", longitude);
        const rider = await Rider.findOne({ email: email });
        if (rider == null) return res.status(404).json({ status: 404, message: "Invalid Credentials" });
        if (rider?.password !== password) return res.status(404).json({ status: 404, message: "Invalid Credentials" });
        await Rider.findByIdAndUpdate(rider._id, {
            location: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        });
        const token = jwt.sign(
            {
                riderId: rider._id.toString()
            },
            "somesecretsecret",
            { expiresIn: "24h" }
        );
        res.status(200).json({ token: token, message: "Rider Logged In", status: 200, data: rider });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/loginpractice", async (req, res) => {
    try {
        const { email, password } = req.body;
        const rider = await Rider.findOne({ email: email });
        if (rider == null) return res.status(404).json({ status: 404, message: "Invalid Credentials" });
        if (rider?.password !== password) return res.status(404).json({ status: 404, message: "Invalid Credentials" });

        res.status(200).json({ message: "Rider Logged In", status: 200 });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("/getAll", async (req, res) => {
    try {
        const data = await Rider.find();
        if (data?.length === 0) {
            return res.json({ status: 404, message: "No Rider Found" });
        }
        return res.json({ status: 200, data });
    } catch (error) {
        console.log(error);
        return res.json({ status: 500, error });
    }
});

router.get("/getbylocation", async (req, res) => {
    try {
        const center = {
            longitude: -0.118092,
            latitude: 51.509865
        };
        const radius = 2000;
        const data = await Rider.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[center.longitude, center.latitude], radius / 6371000]
                }
            }
        });
        if (data?.length === 0) {
            return res.json({ status: 404, message: "No Rider Found" });
        }
        return res.json({ status: 200, data });
    } catch (error) {
        console.log(error);
        return res.json({ status: 500, error });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const delRider = await Rider.findByIdAndDelete(id);
        if (!delRider) {
            return res.json({ status: 404, message: "Rider not Found" });
        }
        return res.json({ status: 200, message: "Rider Deleted" });
    } catch (error) {
        console.log(error);
        return res.json({ status: 500, error });
    }
});

router.put(
    "/update/:id",
    upload.fields([
        { name: "cnicFront", maxCount: 1 },
        { name: "cnicBack", maxCount: 1 },
        { name: "license", maxCount: 1 },
        { name: "selfiPic", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const { id } = req.params;
            if (req.files) {
                if (req.files.cnicFront) {
                    req.body.cnicFront = req.files.cnicFront[0].originalname;
                }
                if (req.files.cnicBack) {
                    req.body.cnicBack = req.files.cnicBack[0].originalname;
                }
                if (req.files.license) {
                    req.body.license = req.files.license[0].originalname;
                }
                if (req.files.selfiPic) {
                    req.body.selfiPic = req.files.selfiPic[0].originalname;
                }
            }
            const data = await Rider.findByIdAndUpdate(id, req.body, { new: true });
            if (!data) {
                return res.json({ status: 404, message: "No Rider Found" });
            }
            return res.json({ status: 200, data, message: "Rider Updated" });
        } catch (error) {
            console.log(error);
            return res.json({ status: 500, error });
        }
    }
);

module.exports = router;
