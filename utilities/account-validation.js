const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
          .custom(async (account_email) => {
              const emailExists = await accountModel.checkExistingEmail(account_email)
              if (emailExists) {
                  throw new Error ("Email exists. Please login or use a different email")
              }
      } ) ,
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}
  
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
    errors = validationResult(req)

    console.log("HERE ARE THE ERRORS I WANT TO SEE", errors.array())

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
        account_email,
    registrationCSS: "/css/registration.css"
    })
    return
  }
  next()
}

validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage("Please provide a valid email address"),

        body("account_password")
            .notEmpty()
            .withMessage("Password is required")
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/)
            .withMessage(
                "Password must be at least 12 characters long and include uppercase, lowercase, number, and special character"
            )
    ];
};

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []

  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/logIn", {
      errors,
      title: "Login",
      nav,
      account_email,
      logInCSS: "/css/logIn.css"
    })
    return
  }

  next()
}


/*  **********************************
 *  Update Account Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id
        const account = await accountModel.getAccountByEmail(account_email)
        // Check if email exists AND belongs to a different account
        if (account && account.account_id != account_id) {
          throw new Error("Email exists. Please use a different email")
        }
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue to update account
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/edit-account", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      registrationCSS: "/css/registration.css"
    })
    return
  }
  next()
}

/*  **********************************
 *  Password Update Validation Rules
 * ********************************* */
validate.passwordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check password data and return errors or continue to update password
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_password } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/edit-account", {
      errors,
      title: "Edit Account",
      nav,
      account_password,
      registrationCSS: "/css/registration.css"
    })
    return
  }
  next()
}


module.exports = validate