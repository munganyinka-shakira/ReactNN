const {
  getAllLaptopOwner,
  createLaptopOwner,
  updateLaptopOwner,
  deleteLaptopOwner
} = require("../controllers/laptopOwner.controller");
const {
  auth
} = require("../middlewares/auth.middleware");

module.exports = (app) => {

  var router = require("express").Router();

  // Create a new User
  router.route("/")
    
    .get([auth, getAllLaptopOwner])
    
    .post([auth, createLaptopOwner]);

  // Create a new User
  router.route("/:id")
    
    .put([auth, updateLaptopOwner])
   
    .delete([auth, deleteLaptopOwner]);

  app.use("/api/laptopOwners", router);
};