let PharmacyOrder = require("../infrastructure/models/pharmacyOrder")
let Pharmacy = require("../infrastructure/models/pharmacy")
let User = require("../infrastructure/models/user")
const { ObjectId } = require("mongodb");
const { notify } = require('../util/notification');

function socket(io) {
    const userNsp = io.of("/user");
    const pharmacyNsp = io.of("/pharmacy");
    const riderNsp = io.of("/rider");

    userNsp.on("connection", (socket) => {
        console.log("user socket connected");
        socket.on("newOrder", async (data, cb) => {
            try {
                // data,data.images = data.images.map((image) => image.filename);
                let order = new PharmacyOrder(data)
                await order.save()
                // console.log(result);
                cb({ status: "success", data: order });
                // console.log(result, ";;;;;;;;;;;;;;");

                // const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000);
                // const oldOrder = await PharmacyOrder.find({
                //     createdAt: {
                //         $gte: fifteenMinutesAgo,
                //     },
                // });
                // if (oldOrder.length > 0) {
                //     for (const order of oldOrder) {
                //         await PharmacyOrder.updateById(order._id, { status: "cancelled" });
                //     }
                // }
                if (data.OrderMethod == "Pickup") {
                    pharmacyNsp.emit("pickupOrder", { status: "success", data: order });
                    let pharmacys=Pharmacy.find({serviceOptions:'pickup'});
                    pharmacys.forEach((element) => {
                        console.log(element.fcmToken)
                         notify(element.fcmToken, "New pickup order", `New pickup order has been made`)
                    });

                    // notify(rider.dataValues.fcmToken, "New Ride", `New Hourly Ride request has been made`)
                } else {
                    pharmacyNsp.emit("deliveryOrder", { status: "success", data: order });

                    let pharmacys=Pharmacy.find({serviceOptions:'delivery'})
                    pharmacys.forEach(element => {
                         notify(element.fcmToken, "New delivery order", `New delivery order has been made`)
                    });
                    // let riders = await Rider.find({});
                    // riders.forEach(async (rider) => {
                    //     await notify(rider.fcmToken, "New Order Available", `A new order is available for delivery`);
                    // });
                }

                console.log("newOrder", "success");
            } catch (error) {
                cb({ status: "error", message: error.message });
            }
        })
        socket.on("acceptBid", async (data, cb) => {
            try {
                console.log("accepted Bid", data);
                let pharmacyId = new ObjectId(data.pharmacyId)
                let order = await PharmacyOrder.findByIdAndUpdate(data.id, { OrderStatus: "accepted", pharmacyId: pharmacyId })
                // console.log(result);
                cb({ status: "success", data: order });
                console.log("68", order);
                pharmacyNsp.emit("acceptBid", { status: "success", data: order });
                console.log(order);
                riderNsp.emit("receiveAcceptedOrder", { status: "success", data: order });
                console.log("acceptBid", "success");
            } catch (error) {
                cb({ status: "error", message: error.message });
                // console.log(error, ";;;;;;;;;;;;;");

            }
        })
        socket.on("orderCompleted", async (data, cb) => {
            try {

               
                let order = await PharmacyOrder.findByIdAndUpdate(data.id, { OrderStatus: "completed" })
                // console.log(result);
                cb({ status: "success", data: order });
                // console.log(result, ";;;;;;;;;;;;;;");

                pharmacyNsp.emit("orderCompleted", { status: "success", data: order });
                console.log("acceptBid", "success");
            } catch (error) {
                cb({ status: "error", message: error.message });
                // console.log(error, ";;;;;;;;;;;;;");

            }
        })
        socket.on("cancelOrder", async (data, cb) => {
            try {

                let order = await PharmacyOrder.findByIdAndUpdate(data.id, { OrderStatus: "cancelled" })
                // console.log(result);
                // console.log(result, ";;;;;;;;;;;;;;");
                
                pharmacyNsp.emit("cancelOrder", { status: "success", data: order });
                let pharmacy = await Pharmacy.findById(order.pharmaId)
                console.log(pharmacy)
                notify(pharmacy.fcmToken, "Cancel Order", `User has cancel his order`)
                console.log("cancelOrder", "success");
                cb({ status: "success", data: order });
            } catch (error) {
                console.log()
                cb({ status: "error", message: error.message });
                // console.log(error, ";;;;;;;;;;;;;");

            }
        })
    })

    pharmacyNsp.on("connection", (socket) => {
        console.log("pharmacyNsp socket connected");

        socket.on("pharmacyBid", async (data, cb) => {
            try {
                console.log("123", data); //done
                let id = data.id
                delete data.id
                let order = await PharmacyOrder.findByIdAndUpdate(id, data)
                let pharmacy = await Pharmacy.findById(data.pharmaId)
                console.log("128", pharmacy) //null
                // console.log(result);
                cb({ status: "success", data: order });
                // console.log(result, ";;;;;;;;;;;;;;");
                order = await PharmacyOrder.findById(id)
                console.log("133", order) //done
                userNsp.emit("pharmacyBid", { status: "success", data: { order, pharmacy } });
                let user= await User.findById(order.userId);
                notify(user.fcmToken, "Pharmacy order request", `pharmacy has made a request related to your order`)
                console.log("pharmacyBid", "success");
            } catch (error) {
                cb({ status: "error", message: error.message });
                // console.log(error, ";;;;;;;;;;;;;");ß

            }
        })
        socket.on("pharmacyRider", async (data, cb) => {
            try {

            } catch (error) {
                cb({ status: "error", message: error.message });
            }
        })
        socket.on("cancelOrder", async (data, cb) => {
            try {

              
                let order = await PharmacyOrder.findByIdAndUpdate(data.id, { OrderStatus: "cancelled" })
                // console.log(result);
                cb({ status: "success", data: order });
                // console.log(result, ";;;;;;;;;;;;;;");

                userNsp.emit("cancelOrder", { status: "success", data: order });
                let user = await User.findById(order.userId);
                notify(user.fcmToken, "Cancel Order", `Pharmacy has canceled your order`)
                console.log("cancelOrder", "success");
            } catch (error) {
                cb({ status: "error", message: error.message });
                // console.log(error, ";;;;;;;;;;;;;");

            }
        })
    })

    riderNsp.on("connection", (socket) => {
        console.log(`rider socket connected with id : ${socket.id}`);

        socket.on("acceptedOrder", async (data) => {
            try {
                console.log("Received acceptedOrder from user app:");
                socket.emit("receiveAcceptedOrder", data)
                console.log("data", data);
            } catch (error) {
                console.error("Error handling acceptedOrder:", error.message);
            }
        });
    })
}
module.exports = socket