const express = require("express");
const { validateUser, UserModel } = require("../models/userModel");
const {
  validateAdminUser,
  AdminUserModel,
  validateLogin,
  genToken,
} = require("../models/adminUserModel");

const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { authAdmin } = require("../middlewares/auth");
require("dotenv").config();
const { pick } = require("lodash");
// const { verifyUserEmail } = require("../middlewares/sendEmail");
const open = require("open");

router.get("/", (req, res) => {
  res.json({ msg: "Users work" });
});

// all users
router.get("/usersList", authAdmin, async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page >= 1 ? req.query.page - 1 : 0;
  try {
    let data = await UserModel.find({})
      .limit(perPage)
      .skip(page * perPage);
    res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// // get amount of users
// router.get("/amount", async (req, res) => {
//   try {
//     let cat = req.query.cat || null;
//     objFind = cat ? { cat_short_id: cat } : {};
//     // countDocuments -> return just the amount of documents in the collections
//     let data = await UserModel.countDocuments(objFind);
//     res.json({ amount: data });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

// //check the user's token validate and return info about the user role
// router.get("/checkUserToken", auth, async (req, res) => {
//   res.json({
//     status: "ok",
//     msg: "token has been verified",
//     tokenData: req.tokenData,
//   });
// });

// user info
// router.get("/myInfo", auth, async (req, res) => {
//   try {
//     let data = await UserModel.findOne(
//       { _id: req.tokenData._id },
//       { password: 0 }
//     );
//     res.json(data);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json(err);
//   }
// });

// admin user info
router.get("/myInfo", authAdmin, async (req, res) => {
  try {
    let data = await AdminUserModel.findOne(
      { _id: req.tokenData._id },
      { password: 0 }
    );
    console.log(data);
    res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// //verify account
// router.get("/verify-email", async (req, res) => {
//   let token = req.query.token || null;
//   if (token) {
//     try {
//       let data = await UserModel.updateOne(
//         { emailToken: token },
//         //update verified to true and remove email token
//         { verified: true, $unset: { emailToken: "" } }
//       );
//       return res.redirect(process.env.CLIENT_URL + "/welcome");
//     } catch (error) {
//       console.log(error);
//       return res.status(400).json({ msg: error });
//     }
//   } else {
//     return res.status(400).json({ msg: "Accound not found" });
//   }
// });

// add new user
router.post("/", async (req, res) => {
  // check validate req.body
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    await user.save();
    res.status(201).json({ user, status: 201 });
  } catch (err) {
    if (err.code == 11000) {
      return res
        .status(400)
        .json({ err: "המייל קיים במערכת שלנו", code: 11000 });
    }
    console.log(err);
    return res.status(500).json(err);
  }
});

// add new Admin user
router.post("/adminRegister", async (req, res) => {
  // check validate req.body
  let validBody = validateAdminUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new AdminUserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    res.status(200).json({ token: genToken(user._id, user.role), user: user });
  } catch (error) {
    let msg;
    if (error.code === 11000) {
      msg = "User already exists";
    } else {
      msg = error.message;
    }
    res.status(400).json(msg);
  }
});

// login
router.post("/login", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validateLogin.error) {
    res.status(400).json(validBody.error.details);
  }
  try {
    let user = await AdminUserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ err: "User account was not found" });
    }
    let validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(401).json({ err: "Email or password is wrong" });
    }
    res.json({
      token: genToken(user._id, user.role),
      userInfo: { role: user.role, name: user.name },
    });
  } catch (err) {
    console.log(err);
  }
});

//check the user's token validate and return info about the user role
router.get("/checkUserToken", authAdmin, async (req, res) => {
  res.json({
    status: "ok",
    msg: "token has been verified",
    tokenData: req.tokenData,
  });
});

// // router.put("/", auth, async (req, res) => {
// //   req.body.password = req.tokenData.password
// //   let validBody = validateUser(req.body);
// //   if (validBody.error) {
// //     return res.status(400).json(validBody.error.details);
// //   }
// //   try {
// //     let data = await UserModel.updateOne(
// //       { _id: req.tokenData._id }, req.body );
// //     res.json(data);
// //   } catch (err) {
// //     console.log(err);
// //     return res.status(500).json(err);
// //   }
// // });

// // can change the role of user to admin user or courier, must be admin in this endpoint
// router.patch("/changeRole/:userId/:role", authSystemAdmin, async (req, res) => {
//   let userId = req.params.userId;
//   let role = req.params.role;
//   try {
//     // prevent from user to changch himself or the first admin
//     if (userId != req.tokenData._id && userId != "61ee907a96a80382f70b873e") {
//       let data = await UserModel.updateOne({ _id: userId }, { role: role });
//       res.json(data);
//     } else {
//       res.status(401).json({ err: "You cant change your self" });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json(err);
//   }
// });

// //applying for a courier position
// router.patch("/applyingForCourier", auth, async (req, res) => {
//   try {
//     let data = await UserModel.updateOne(
//       { _id: req.tokenData._id },
//       { role: "apply_for_courier" }
//     );
//     res.json(data);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json(err);
//   }
// });

// // del user - DELETE
// router.delete("/delete/:delId", authSystemAdmin, async (req, res) => {
//   let delId = req.params.delId;
//   try {
//     if (delId != req.tokenData._id && delId != "624ec1afab89e9f16e36cb6c") {
//       let data = await UserModel.deleteOne({
//         _id: delId,
//       });
//       // deletedCount -> 1 del success msg
//       res.json(data);
//     } else {
//       res
//         .status(401)
//         .json({ err: "You cant delete your self Or the superAdmin" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

module.exports = router;
