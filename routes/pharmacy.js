const express = require("express");

const router = express.Router();

const { resolveError } = require("../public/javascripts/error");

const isAuth = require("../middleware/isAuth");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const Pharmacy = require("../infrastructure/models/pharmacy");

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
        // count pharmacy instance in database

        const pharmaciesCount = await Pharmacy.countDocuments({});
        const newSellers = await Pharmacy.countDocuments({ status: "pending" });

        const pharmacyList = await Pharmacy.find();

        const oldSellers = pharmacyList.length - newSellers;

        res.status(200).json({ pharmaciesCount: pharmaciesCount, newSellers: newSellers, oldSellers: oldSellers, pharmacyList: pharmacyList });
    } catch (err) {
        resolveError(err, res);
    }
});

router.post("/adminPanel/setBlock/:id", isAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { block } = req.body;

        const pharmacy = await Pharmacy.findById(id);

        if (JSON.parse(block)) pharmacy.blocked = true;
        else pharmacy.blocked = false;

        await pharmacy.save();

        res.status(200).json({ message: "pharmacy updated" });
    } catch (err) {
        resolveError(err, res);
    }
});

router.post("/adminPanel/update/:id", isAuth, async (req, res, next) => {
    try {
        const { id } = req.params;

        await Pharmacy.findByIdAndUpdate(id, req.body);

        res.status(200).json({ message: "pharmacy updated" });
    } catch (err) {
        resolveError(err, res);
    }
});

router.delete("/adminPanel/delete/:id", isAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        await Pharmacy.findByIdAndDelete(id);
        res.status(200).json({ message: "pharmacy deleted" });
    } catch (err) {
        resolveError(err, res);
    }
});

// user side api's

router.post("/register", async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;

        let pharmacy = await Pharmacy.findOne({ phoneNumber: phoneNumber });
        if (pharmacy != null) return res.status(200).json({ message: "pharmacy with this phone number already exist" });

        pharmacy = new Pharmacy(req.body);
        await pharmacy.save();

        const token = jwt.sign(
            {
                userId: pharmacy._id.toString()
            },
            "somesecretsecret",
            { expiresIn: "30d" }
        );

        res.status(200).json({ status: "success", data: pharmacy, token: token, message: "pharmacy created" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post( "/update",
    isAuth,
    upload.fields([
        { name: "legalPharmacyImages", maxCount: 5 },
        { name: "profilePic", maxCount: 1 }
    ]),
    async (req, res, next) => {
        try {
            let pharmacy = await Pharmacy.findById(req.userId);

            let pharmacyLegalDocumentImages = [];
            let logo = "";

            if (req.files && req.files.legalPharmacyImages != undefined) {
                pharmacyLegalDocumentImages = req.files.legalPharmacyImages.map((image) => image.filename);
                pharmacy.pharmacyLegalDocumentImages = pharmacyLegalDocumentImages;
            }

            if (req.files && req.files.profilePic != undefined) {
                logo = req.files.profilePic[0].filename;
                pharmacy.logo = logo;
            }

            if (req.body.location) req.body.location = JSON.parse(req.body.location);
            console.log(req.body.location);
            if (req.body.chargesPerKm) req.body.chargesPerKm = JSON.parse(req.body.chargesPerKm);

            // console.log(JSON.parse(req.body.location));
            pharmacy.set(req.body);

            await pharmacy.save();

            res.status(200).json({status:"success",data:pharmacy, message: "pharmacy updated" });
        } catch (error) {
            resolveError(error, res);
        }
    }
);


router.post( "/upload",
    upload.fields([
        { name: "images", maxCount: 5 },
        
    ]),
    async (req, res, next) => {
        try {
            let URL=[]

            if (req.files && req.files.images != undefined) {
                URL = req.files.images.map((image) => image.filename);
                
            }

            
            res.status(200).json({status:"success",data:URL, message: "picture uploaded" });
        } catch (error) {
            resolveError(error, res);
        }
    }
);


router.post( "/uploadVoice",
    upload.fields([
        { name: "voice", maxCount: 1 },
        
    ]),
    async (req, res, next) => {
        try {
            let URL=[]

            URL=req.files.voice[0].filename

            
            res.status(200).json({status:"success",data:URL, message: "voice uploaded" });
        } catch (error) {
            resolveError(error, res);
        }
    }
);



router.post("/login", async (req, res) => {
    try {
        const { phoneNo } = req.body;



        const pharmacy = await Pharmacy.findOne({ phoneNumber: phoneNo });

        if (pharmacy == null) return res.status(404).json({ message: "pharmacy not found" });

        const token = jwt.sign(
            {
                pharmacy: pharmacy._id.toString()
            },
            "somesecretsecret",
            { expiresIn: "30dh" }
        );

        res.status(200).json({status:"success",data:pharmacy, token: token, message: "Pharmacy login successfully" });
    } catch (error) {
        resolveError(error, res);
    }
});

module.exports = router;
