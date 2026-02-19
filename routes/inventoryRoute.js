// Needed Resources
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")

// Route to build search/filter view (public route)
router.get("/search",
    invValidate.filterRules(),
    invValidate.checkFilterData,
    utilities.handleErrors(invController.buildFilteredInventory));

// Route to build management view 
router.get("/",
    utilities.checkLogin,
    utilities.checkAccountType(),
    utilities.handleErrors(invController.buildManagement));

//Route to edit the inventory 
router.get("/getInventory/:classification_id",
    utilities.checkLogin,
    utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id",
    utilities.checkLogin,
    utilities.checkAccountType(),
    utilities.handleErrors(invController.editInventoryView))

// Route to build add-classification view
router.get("/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType(),
    utilities.handleErrors(invController.buildAddClassification))

router.post("/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType(),
    classValidate.classificationRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.registerClassification)
)

//Route to build add-inventory view

router.get("/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType(),
    utilities.handleErrors(invController.buildAddInventory))

router.post("/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType(),
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.registerInventory)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build the item view
router.get("/detail/:inv_id",
    utilities.handleErrors(invController.buildByInventoryId));

//Route to build the editing inventory view
router.post("/edit-inventory/",
    utilities.checkLogin,
    utilities.checkAccountType(),
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

//Route to build the delete inventory view
router.get("/delete/:inv_id", 
    utilities.checkLogin,
    utilities.checkAccountType(),
    utilities.handleErrors(invController.deleteItemView)
)

router.post("/delete-confirm",
    utilities.checkLogin,
    utilities.checkAccountType(),
    utilities.handleErrors(invController.deleteItem))


module.exports = router;
