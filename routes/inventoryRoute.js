// Needed Resources
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")

// Route to build management view 
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

router.post("/add-classification",
    classValidate.classificationRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.registerClassification)
)

//Route to build add-inventory view

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

router.post("/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.registerInventory)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build the item view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));



module.exports = router;
