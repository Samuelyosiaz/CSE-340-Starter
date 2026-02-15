const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogIn(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/logIn", {
    title: "Login",
    nav,
    logInCSS: "/css/logIn.css",
    errors: null
  })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/registration", {
    title: "Register",
    nav,
    errors: null,
    registrationCSS: "/css/registration.css"
  })
}

/* ****************************************
                            *  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body


  //Hash de password before storing

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
      registrationCSS: "/css/registration.css"
    })
  }


  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/logIn", {
      title: "Login",
      nav,
      logInCSS: "/css/logIn.css",
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors: null, 
      account_firstname,
      account_lastname,
      account_email,
      registrationCSS: "/css/registration.css"
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/logIn", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      logInCSS: "/css/logIn.css"
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/logIn", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        logInCSS: "/css/logIn.css"
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


async function accountManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}


// ...existing code...

async function logOut(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "See you next time")
  res.redirect("/")
}

/* ****************************************
 *  Build edit account view
 * ************************************ */
async function buildEditAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    registrationCSS: "/css/registration.css"
  })
}

/* ****************************************
 *  Process account update
 * ************************************ */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    delete updateResult.account_password
    const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    
    if(process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    
    req.flash("notice", `Account updated successfully.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      registrationCSS: "/css/registration.css"
    })
  }
}

/* ****************************************
 *  Process password update
 * ************************************ */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password change.')
    res.status(500).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      registrationCSS: "/css/registration.css"
    })
    return
  }

  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (updateResult) {
    req.flash("notice", `Password changed successfully.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      registrationCSS: "/css/registration.css"
    })
  }
}

module.exports = { 
  buildLogIn, 
  buildRegistration, 
  registerAccount, 
  accountLogin, 
  accountManagement, 
  logOut,
  buildEditAccount,
  updateAccount,
  updatePassword
}
