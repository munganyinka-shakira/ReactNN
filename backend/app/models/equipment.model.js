const mongoose = require("mongoose");
const Joi = require('joi');
const mongoosePaginate = require('mongoose-paginate-v2');



var schema = mongoose.Schema({
  chasisNumber: {
    type: String,
    required: true,
  },
  laptop_manufacturer: {
    type: String,
    required: true,
  },
  
  serialNumber: {
    type: Number,
    required: true,
  },
  Model: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});
schema.plugin(mongoosePaginate);

const Model = mongoose.model("laptop", schema);

module.exports.Laptop = Model;
module.exports.validateLaptop = (body) => {
  return Joi.object({
    chasisNumber: Joi.string().required(),
    laptop_manufacturer: Joi.string().required(),
    serialNumber: Joi.number().min(0).required(),
    Model: Joi.string().required(),
  }).validate(body);
};