const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/", utilities.handleErrors(accountController.accountManagement))

router.get("/logIn", utilities.handleErrors(accountController.buildLogIn))

router.get("/logOut", utilities.handleErrors(accountController.logOut))

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
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Edit account routes
router.get("/edit-account",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildEditAccount)
)

router.post("/edit-account",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

router.post("/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router