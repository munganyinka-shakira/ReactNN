const mongoose = require("mongoose");
const Joi = require('joi');
const mongoosePaginate = require('mongoose-paginate-v2');
const { NationalIdPattern, PhoneRegex } = require("./user.model");



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
  laptop_manufacturer: {
    type: String,
    required: true,
  },
  Model: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    unique: true,
    required: true,
  },
 
}, {
  timestamps: true
});
schema.plugin(mongoosePaginate);

const Model = mongoose.model("laptopOwner", schema);

module.exports.LaptopOwner = Model;
module.exports.validateLaptopOwner = (body) => {
  return Joi.object({
    names: Joi.string().required(),
    phone: Joi.string().pattern(PhoneRegex).required(), // validate phone
    address: Joi.string().required(),
    nationalId: Joi.string().pattern(NationalIdPattern).length(16).required(),
  }).validate(body);
};