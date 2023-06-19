const {
  getAllEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment
} = require("../controllers/equipment.controller");
const {
  auth
} = require("../middlewares/auth.middleware");

module.exports = (app) => {

  var router = require("express").Router();

  router.route("/")
  
    .get([auth, getAllEquipments])
    
    .post([auth, createEquipment]);

  router.route("/:id")
   
    .put([auth, updateEquipment])
   
    .delete([auth, deleteEquipment]);

  app.use("/api/equipments", router);
};