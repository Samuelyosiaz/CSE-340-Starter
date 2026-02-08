const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/logIn", utilities.handleErrors(accountController.buildLogIn))

router.get("/registration", utilities.handleErrors(accountController.buildRegistration))

router.post(
  "/registration",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/logIn",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router