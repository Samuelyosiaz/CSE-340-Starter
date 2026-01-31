const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Route to trigger error
router.get("/error", utilities.handleErrors(errorController.triggerError))

module.exports = router