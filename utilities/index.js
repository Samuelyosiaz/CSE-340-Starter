const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}



//Code to display the html of the item view
Util.buildItemDetail = async function(data) {
  let detail
  if (data.length > 0) {
    const vehicle = data[0] 
    detail = '<section id="inv-detail">'
    detail += '<h1><strong>(' + vehicle.inv_year + ') ' + vehicle.inv_make + ' '+ vehicle.inv_model + ' ' + '</strong></h1>'
    detail += '<img src="' + vehicle.inv_image + '" alt="Image of ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors">'
    detail += '<div class="vehicle-info">'
    detail += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
    detail += '<p id=price class=element><strong>Price: $' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</strong></p>'
    detail += '<p id=description class=element><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
    detail += '<p id=color class=element><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
    detail += '<p id=miles class=element><strong>Miles: </strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
    detail += '</div>'
    detail += '</section>'
  } else {
    detail = '<p class="notice">Sorry, no vehicle details could be found.</p>'
  }
  return detail
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* **************************************
* Build the makes dropdown list
* ************************************ */
Util.buildMakesList = async function (selectedMake = null) {
  let data = await invModel.getDistinctMakes()
  let makesList = '<select name="inv_make" id="makesList">'
  makesList += '<option value="">All brands</option>'
  data.forEach((row) => {
    makesList += '<option value="' + row.inv_make + '"'
    if (selectedMake != null && row.inv_make == selectedMake) {
      makesList += ' selected'
    }
    makesList += '>' + row.inv_make + '</option>'
  })
  makesList += '</select>'
  return makesList
}
  
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/logIn")
  }
}

 /* ****************************************
 *  Check Login
 * ************************************ */
Util.checkAccountType = (allowedTypes = ["Admin", "Employee"]) => {
  return (req, res, next) => {
    if (res.locals.accountData && allowedTypes.includes(res.locals.accountData.account_type)) {
      next()
    } else {
      req.flash("notice", "You do not have permission to access this resource.")
      return res.redirect("/account/logIn")
    }
  }
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util