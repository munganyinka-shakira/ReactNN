const {
  getAllEquipementLaptopOwners,
  createEquipmentLaptopOwner,
  updateEquipmentLaptopOwner,
  deleteEquipmentLaptopOwner
} = require("../controllers/equipmentLaptopOwner.controller");
const {
  auth
} = require("../middlewares/auth.middleware");

module.exports = (app) => {

  var router = require("express").Router();

  // Create a new User
  router.route("/")
    
    .get([auth, getAllEquipementLaptopOwners])
    
    .post([auth, createEquipmentLaptopOwner]);

  // Create a new User
  router.route("/:id")
   
    .put([auth, updateEquipmentLaptopOwner])
   
    .delete([auth, deleteEquipmentLaptopOwner]);

  app.use("/api/equipmentCarOwners", router);
};