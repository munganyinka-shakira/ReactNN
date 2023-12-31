const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require('jsonwebtoken');



var schema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  nationalId: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  
  password: {
    type: String,
    required: true,
  },
  
}, {
  timestamps: true
});

// generate login token
schema.methods.generateAuthToken = function () {
  return jwt.sign({
    id: this._id,
  }, process.env.JWT_SECRET, {
    expiresIn: '5h'
  })
};

const Model = mongoose.model("user", schema);
module.exports.NationalIdPattern = /(?<!\d)\d{16}(?!\d)/;
module.exports.PhoneRegex = /(?<!\d)\d{10}(?!\d)/

module.exports.User = Model;
module.exports.validateUser = (body,isUpdating=false) => {
  return Joi.object({
    names: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(this.PhoneRegex).required(), // validate phone
    password: isUpdating ? Joi.string().min(6) : Joi.string().min(6).required(),
    nationalId: Joi.string().pattern(this.NationalIdPattern).length(16).required(),
  }).validate(body);
};

module.exports.validateUserLogin = (body) => {
  return Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }).validate(body);
};