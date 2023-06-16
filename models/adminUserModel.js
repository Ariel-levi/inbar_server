const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const adminUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "user",
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
});

exports.AdminUserModel = mongoose.model("adminusers", adminUserSchema);

exports.validateAdminUser = (_bodyReq) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().min(2).max(150).email().required(),
    password: Joi.string().min(3).max(100).required(),
  });
  return joiSchema.validate(_bodyReq);
};

exports.genToken = (_userId, _role) => {
  let token = jwt.sign({ _id: _userId, role: _role }, process.env.JWT_SECRET, {
    expiresIn: "600mins",
  });
  return token;
};

exports.validateLogin = (_bodyReq) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(2).max(150).email().required(),
    password: Joi.string().min(3).max(100).required(),
  });
  return joiSchema.validate(_bodyReq);
};
