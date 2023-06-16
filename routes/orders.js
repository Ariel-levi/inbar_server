const express = require("express");
const {
  auth,
  payPalAuth,
  authSystemAdmin,
  authCourier,
  authStoreAdmin,
} = require("../middlewares/auth");
const { genShortId } = require("../misc/genShortId");
const { OrderModel, validateOrder } = require("../models/orderModel");
const { ProductModel } = require("../models/productsModel");
const { StoreModel } = require("../models/storeModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    msg: "orders work",
  });
});

router.get("/userOrder", auth, async (req, res) => {
  try {
    let data = await OrderModel.find({
      user_id: req.tokenData._id,
    })
      .limit(20)
      .sort({
        _id: -1,
      }); //return the last 20 orders
    res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get("/allOrders", authCourier, async (req, res) => {
  let perPage = req.query.perPage || 5;
  let page = req.query.page >= 1 ? req.query.page - 1 : 0;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  let user_id = req.query.user_id;
  let status = req.query.status;

  try {
    let filter = user_id ? { user_id } : {};
    filter = status
      ? { ...filter, status }
      : {
          ...filter,
        };
    let data = await OrderModel.find(filter)
      .limit(perPage)
      .skip(perPage * page)
      .sort({
        [sort]: reverse,
      });
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/storeOrders/:idStore", authStoreAdmin, async (req, res) => {
  let idStore = req.params.idStore;
  try {
    // get store short id
    let storeShortId = await StoreModel.findOne(
      { _id: idStore },
      {
        short_id: 1,
      }
    );
    // get all the store orders
    let allStoreOrders = await OrderModel.find({
      store_short_id: storeShortId.short_id,
    });
    res.json(allStoreOrders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get the store with the orders
router.get("/storesWithOrders", authCourier, async (req, res) => {
  try {
    // get all orders
    let allOrders = await OrderModel.find({ status: "paid" });
    // get all stores
    let allStores = await StoreModel.find({});
    let data = [];

    allStores.forEach((store) => {
      // create empty array to save each store's orders
      let ordersArr = [];
      allOrders.forEach((order) => {
        if (store.short_id === order.store_short_id) {
          ordersArr.push(order);
        }
      });
      // push all storse with orders
      if (ordersArr.length > 0) {
        data.push({ store: store, orders: ordersArr });
      }
    });

    res.json({ data });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get order details store info and user name and email
router.get("/deliveryInfo/:idOrder", authCourier, async (req, res) => {
  try {
    let order = await OrderModel.findOne({
      _id: req.params.idOrder,
    });
    let store = await StoreModel.findOne({
      short_id: order.store_short_id,
    });
    let user = await UserModel.findOne(
      { _id: order.user_id },
      { name: 1, email: 1 }
    );
    res.status(200).json({ order, store, user });
  } catch (error) {
    res.status(500).json(error);
  }
});

// return the orders' amount
router.get("/allOrdersCount", auth, async (req, res) => {
  try {
    let amount = await OrderModel.countDocuments({});
    res.json({
      amount,
    });
  } catch (error) {
    log.error(error);
    return res.status(500).json(error);
  }
});

router.get("/productsInfo/:idOrder", auth, async (req, res) => {
  try {
    let order = await OrderModel.findOne({
      _id: req.params.idOrder,
    });
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/", auth, async (req, res) => {
  let validBody = validateOrder(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // get user's data
    let user = await UserModel.findOne({
      _id: req.tokenData._id,
    });
    req.body.name = user.name;
    req.body.address = user.address;
    req.body.phone = user.phone;
    // check if there already order of the same user that pending
    let order = await OrderModel.findOne({
      user_id: req.tokenData._id,
      status: "pending",
    });
    if (order) {
      // update
      let data = await OrderModel.updateOne(
        {
          _id: order._id,
        },
        req.body
      );
      return res.json(data);
    }
    // add new order
    let newOrder = new OrderModel(req.body);
    newOrder.user_id = req.tokenData._id;
    newOrder.short_id = await genShortId(OrderModel);
    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.patch("/orderPaid", auth, async (req, res) => {
  let status = "paid";
  try {
    //check if paypal did the transaction
    let tokenId = req.body.tokenId;
    let orderId = req.body.orderId;
    let realPay = req.body.realPay == "yes"; // true or false
    let paypalData = await payPalAuth(tokenId, orderId, realPay);
    if (paypalData.status != "COMPLETED") {
      res.status(401).json({
        err_msg: "There is problem with the transaction",
      });
    }
    // get the ids of the penging order
    let currentOrder = await OrderModel.findOne({
      status: "pending",
      user_id: req.tokenData._id,
    });
    let shorProds_ids = currentOrder.products_ar.map((item) => {
      return item.s_id;
    });
    //get the details of the products
    let prod_ar = await ProductModel.find({
      short_id: {
        $in: shorProds_ids,
      },
    });
    //substruct 1 from each product
    prod_ar.forEach(async (item) => {
      item.qty -= 1;
      // update the new quantity
      await ProductModel.updateOne(
        {
          _id: item._id,
        },
        item
      );
    });
    //update the status to paid
    let data = await OrderModel.updateOne(
      {
        status: "pending",
        user_id: req.tokenData._id,
      },
      {
        status,
      }
    ); //shortcut becouse is same name
    // modifiedCount
    res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// route update order status
// ?status =
router.patch("/:orderId", authSystemAdmin, async (req, res) => {
  let status = req.query.status || "pending";
  let orderId = req.params.orderId;
  try {
    let data = await OrderModel.updateOne(
      {
        _id: orderId,
      },
      {
        status,
      }
    ); //shortcut becouse is same name
    // modifiedCount
    res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.delete("/:delId", authSystemAdmin, async (req, res) => {
  let orderId = req.params.delId;
  try {
    let data = await OrderModel.deleteOne({
      _id: orderId,
    });
    // modifiedCount
    res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//taking order by driver
router.patch("/shipping/takingOrder", authCourier, async (req, res) => {
  let orderId = req.body.orderId;
  let user = req.tokenData;
  try {
    let data = await OrderModel.updateOne(
      {
        _id: orderId,
        status: "paid",
      },
      {
        status: "shipped",
        driver_id: user._id,
      }
    );
    res.json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//updating the shipment status by the driver (delivered/paid)
router.patch("/shipping/orderStatus", auth, async (req, res) => {
  let orderId = req.body.orderId;
  let status = req.body.status;
  let user = req.tokenData;
  try {
    let data = await OrderModel.updateOne(
      {
        _id: orderId,
        driver_id: user._id,
      },
      {
        status,
      }
    );
    res.json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
