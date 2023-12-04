const ROLES = require("../utils/roles");
const { default: axios } = require("axios");
// const { StoreModel } = require("../models/storeModel");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/userModel");

// if user is already logged in
// exports.auth = (req, res, next) => {
//   let token = req.header("x-api-key");
//   if (!token) {
//     return res.status(401).json({ err: "No token found" });
//   }
//   try {
//     let decodeToken = jwt.verify(token, process.env.JWT_SECRET);
//     req.tokenData = decodeToken;
//     next();
//   } catch (err) {
//     return res.status(401).json({ err: "Invalid token" });
//   }
// };

exports.authAdmin = (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ err: "No token found" });
  }
  try {
    let decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    // check if user role is admin
    if (
      decodeToken.role == ROLES.ADMIN ||
      decodeToken.role == ROLES.SYSTEM_ADMIN
    ) {
      req.tokenData = decodeToken;
      next();
    } else {
      return res.status(401).json({ err: "Access denied" });
    }
  } catch (err) {
    return res.status(401).json({ err: "Invalid token" });
  }
};

// exports.authStoreAdmin = async (req, res, next) => {
//   let token = req.header("x-api-key");
//   let storeId = req.header("store-id");
//   if (!token) {
//     return res.status(401).json({ err: "please log in first" });
//   }
//   try {
//     let decodeToken = jwt.verify(token, process.env.JWT_SECRET);
//     let user = await UserModel.findOne({ _id: decodeToken._id });
//     req.tokenData = decodeToken;
//     if (req.tokenData.role === ROLES.ADMIN) {
//       next();
//     } else {
//       //verify the user id the store's admin or system admin
//       let store = await StoreModel.findOne({
//         _id: storeId,
//         admin_short_id: user.short_id,
//       });
//       if (store) {
//         next();
//       } else {
//         return res.status(401).json({ err: "Access denied" });
//       }
//     }
//   } catch (err) {
//     return res.status(401).json({ err: "Token invalid (if you hacker) or expired" });
//   }
// };

// exports.authCourier = (req, res, next) => {
//   let token = req.header("x-api-key");
//   if (!token) {
//     return res.status(401).json({ err: "You must send token in header to this endpoint" });
//   }
//   try {
//     let decodeToken = jwt.verify(token, process.env.JWT_SECRET);
//     // check if user role is Courier
//     // console.log(decodeToken.role);
//     if (decodeToken.role == "courier" || decodeToken.role == "system_admin") {
//       req.tokenData = decodeToken;
//       next();
//     } else {
//       return res.status(401).json({ err: "You must be courier in this endpoint" });
//     }
//   } catch (err) {
//     return res.status(401).json({ err: "Token invalid (if you hacker) or expired" });
//   }
// };

// exports.payPalAuth = async (_tokenId, _orderId, _ifRealPay = true) => {
//   let url = !_ifRealPay
//     ? "https://api-m.sandbox.paypal.com/v2/checkout/orders/" + _orderId
//     : "https://api-m.paypal.com/v2/checkout/orders/" + _orderId;
//   try {
//     let resp = await axios({
//       method: "GET",
//       url: url,
//       headers: {
//         Authorization: "Bearer " + _tokenId,
//         "content-type": "application/json",
//       },
//     });
//     console.log(resp.data);
//     console.log(resp.data);
//     return resp.data;
//   } catch (err) {
//     console.log(err.response);
//     return err.response;
//   }
// };
