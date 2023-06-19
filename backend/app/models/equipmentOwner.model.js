const mongoose = require("mongoose");
const Joi = require('joi');
const mongoosePaginate = require('mongoose-paginate-v2');



var schema = mongoose.Schema({
  laptopOwner: {
    type: String,
    required: true,
    ref: "laptopOwner"
  },
  equipment: {
    type: String,
    required: true,
    ref: "equipment"
  },
  serialNumber: {
    type: String,
    unique: true,
    required: true,
  }
}, {
  timestamps: true
});
schema.plugin(mongoosePaginate);

const Model = mongoose.model("equipmentOwner", schema);

module.exports.EquipmentLaptopOwner = Model;
module.exports.validateEquipmentLaptopOwner = (body) => {
  return Joi.object({
    laptopOwner: Joi.string().required(),
    equipment: Joi.string().required(),
    serialNumber: Joi.string().required()
  }).validate(body);
};