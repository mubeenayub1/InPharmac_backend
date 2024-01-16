const express = require("express");

const router = express.Router();

const { resolveError } = require("../public/javascripts/error");

const isAuth = require("../middleware/isAuth");

let PharmacyOrder = require("../infrastructure/models/pharmacyOrder")
const { ObjectId } = require("mongodb");


router.post("/adminPanel", async (req, res, next) => {
    try {
        let { orderMethod, whichOrder, filter } = req.body;

        let order;
        let filterObj = {};
        if (whichOrder == "today") {
            const currentDate = new Date();
            const DaysAgo = new Date();
            DaysAgo.setDate(currentDate.getDate() - 1);
            const filter_stage = {
                $match: {
                    orderDate: {
                        $gte: DaysAgo,
                        $lte: currentDate
                    },
                    orderMethod: orderMethod
                }
            };
            const pipeline = [filter_stage];
            let orders = await PharmacyOrder.aggregate(pipeline);
            return res.status(200).send(orders);
        }

        if (whichOrder == "pending") {
            filterObj = {
                status: "pending"
            };
        }

        if (filter) {
            filter = JSON.parse(filter);
            const currentDate = new Date();
            const DaysAgo = new Date();
            DaysAgo.setDate(currentDate.getDate() - (filter + 1));

            filterObj = {
                ...filterObj,
                orderDate: {
                    $gte: DaysAgo,
                    $lte: currentDate
                },
                orderMethod: orderMethod
            };
        }

        let filter_stage = {
            $match: filterObj
        };

        const pipeline = [filter_stage];
        let orders = await PharmacyOrder.aggregate(pipeline);
        let pickUpOrdersCount = await PharmacyOrder.countDocuments({ orderMethod: "pickup" });
        let deliveryOrdersCount = await PharmacyOrder.countDocuments({ orderMethod: "delivery" });
        res.status(200).json({ orders, pickUpOrdersCount, deliveryOrdersCount });
    } catch (err) {
        resolveError(err, res);
    }
});

router.post("/adminPanel/update/:id", isAuth, async (req, res, next) => {
    try {
        let { id } = req.params;
        await PharmacyOrder.findByIdAndUpdate(id, req.body);

        res.status(200).json({ message: "Order updated successfully" });
    } catch (err) {
        resolveError(err, next);
    }
});

router.delete("/adminPanel/delete/:id", isAuth, async (req, res, next) => {
    try {
        let { id } = req.params;
        await PharmacyOrder.findByIdAndDelete(id);

        res.status(200).send({ message: "Order deleted successfully" });
    } catch (err) {
        resolveError(err, next);
    }
});

router.post("/adminPanel/add", isAuth, async (req, res, next) => {
    try {
        let order = new PharmacyOrder(req.body);
        await order.save();

        res.status(200).send({ message: "Order added successfully" });
    } catch (err) {
        resolveError(err, next);
    }
});
router.get("/getAll/:pharmacyId", async (req, res, next) => {
    try {
        let pharmacyId=new ObjectId(req.params.pharmacyId)
        let orders =await PharmacyOrder.find({"pharmacyId":pharmacyId})


        res.status(200).send({ ststus: "success", data: orders });
    } catch (err) {
        console.log(err)
    }
});
// new ObjectId(req.body.favoritePharmacies)
router.get("/getPending/:userId", isAuth, async (req, res, next) => {
    try {
        let orders =await PharmacyOrder.find({OrderStatus:"pending","userId":req.params.userId})


        res.status(200).send({ ststus: "success", data: orders });
    } catch (err) {
        resolveError(err, next);
    }
});
router.get("/getAccepted/:userId", isAuth, async (req, res, next) => {
    try {
        let orders =await PharmacyOrder.find({OrderStatus:"accepted","userId":req.params.userId})


        res.status(200).send({ ststus: "success", data: orders });
    } catch (err) {
        resolveError(err, next);
    }
});



module.exports = router;
