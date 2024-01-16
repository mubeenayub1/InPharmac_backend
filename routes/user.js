const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const Support = require("../infrastructure/models/support");
const UserOrder = require("../infrastructure/models/userOrder");

const { resolveError } = require("../public/javascripts/error");

const jwt = require("jsonwebtoken");
const isAuth = require("../middleware/isAuth");

const User = require("../infrastructure/models/user");

router.get("/adminPanel", isAuth, async (req, res, next) => {
    try {
        const usersCount = await User.countDocuments({});
        const userList = await User.find();

        res.status(200).json({ usersCount: usersCount, userList: userList });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/adminPanel/update/:id", isAuth, async (req, res, next) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, req.body);

    res.status(200).json({ message: "user updated" });
});

router.delete("/adminPanel/delete/:id", isAuth, async (req, res, next) => {
    const { id } = req.params;
    await User.findByIdAndRemove(id);

    res.status(200).json({ message: "user deleted" });
});

router.post("/adminPanel/create", isAuth, async (req, res, next) => {
    try {
        const user = new User(req.body);

        user.deliveryAddress = [req.body.deliveryAddress];
        await user.save();

        res.status(200).json({ message: "user created" });
    } catch (error) {
        resolveError(error, res);
    }
});

// user side api's

router.get("/profile/:userId", async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);

        if (user == null) return res.status(404).json({ message: "user not found" });

        res.status(200).json({ status: "success", user: user });
    } catch (error) {
        console.log(error);
    }
});

router.get("/support", isAuth, async (req, res, next) => {
    try {
        const support = await Support.find({ userId: req.userId });

        res.status(200).json({ support: support });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("orders", isAuth, async (req, res, next) => {
    try {
        const orders = await UserOrder.find({ userId: req.userId });

        res.status(200).json({ orders: orders });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/support", isAuth, async (req, res, next) => {
    try {
        let user = await User.findById(req.userId);

        if (user == null) return res.status(404).json({ message: "user not found" });

        const support = new Support({ ...req.body, userId: req.userId });
        await support.save();

        res.status(200).json({ message: "support created" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/register/withEmail", async (req, res, next) => {
    try {
        const { email } = req.body;

        let user = await User.findOne({ email: email });

        if (user == null) {
            user = new User(req.body);
            await user.save();
        }

        const token = jwt.sign(
            {
                userId: user._id.toString()
            },
            "somesecretsecret",
            { expiresIn: "30d" }
        );

        res.status(200).json({ token: token, message: "user created" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/register/withPhone", async (req, res, next) => {
    try {
        const { phoneNo } = req.body;

        let user = await User.findOne({ phoneNo: phoneNo });

        if (user) {
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id.toString()
                },
                "somesecretsecret",
                { expiresIn: "30d" }
            );

            return res.status(200).json({ code: 200, token: token, data: user, status: "success", message: "user register successfully" });
        }


        user = new User(req.body);
        await user.save();

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            "somesecretsecret",
            { expiresIn: "24h" }
        );



        res.status(201).json({ code: 201, token: token, data: user, status: "success", message: "user register successfully" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/update", isAuth, async (req, res, next) => {
    try {
        let user = await User.findById(req.userId);

        if (user == null) return res.status(404).json({ message: "user not found" });

        if (req.body.deliveryAddress) {
            req.body.deliveryAddress = JSON.parse(req.body.deliveryAddress);
            user.deliveryAddress.push(req.body.deliveryAddress);
            delete req.body.deliveryAddress;
        }

        console.log(typeof req.body.favoritePharmacies);

        if (req.body.favoritePharmacies) {
            if (user.favoritePharmacies.includes(req.body.favoritePharmacies)) {
                let index = user.favoritePharmacies.indexOf(req.body.favoritePharmacies);
                user.favoritePharmacies.splice(index, 1);
            } else {
                user.favoritePharmacies.push(new ObjectId(req.body.favoritePharmacies));
                delete req.body.favoritePharmacies;
            }
        }

        user.set(req.body);

        await user.save();

        res.status(200).json({ status: "success", message: "user updated" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("/favorites/:id", isAuth, async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id).populate({ path: "favoritePharmacies" }).exec();

        if (user == null) return res.status(404).json({ message: "user not found" });

        res.status(200).json({ status: "success", favoritePharmacies: user.favoritePharmacies });
    } catch (error) {
        resolveError(error, res);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { phoneNo } = req.body;
        
        const user = await User.findOne({ phoneNo: phoneNo });

        if (user == null) return res.status(404).json({ message: "user not found" });

        const token = jwt.sign(
            {
                userId: user._id.toString()
            },
            "somesecretsecret",
            { expiresIn: "24h" }
        );

        res.status(200).json({ token: token, message: "user created" });
    } catch (error) {
        resolveError(error, res);
    }
});

router.get("/getAll", async(req, res) => {
    try{
        const data = await User.find();
        if(data?.length === 0){
            return res.json({status: 404, message: "Users not Found"})
        }
        return res.json({status: 200, data})
    }catch(error){
        console.log(error);
        return res.json({status: 500, error})
    }
})

module.exports = router;
