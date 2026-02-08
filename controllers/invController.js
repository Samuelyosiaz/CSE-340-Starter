const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    customCSS: "/css/classification.css"
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryById(inv_id)
    console.log("=== INVENTORY DATA ===")
    console.log("Inventory ID:", inv_id)
    console.log("Data length:", data ? data.length : 'undefined')
    console.log("Full data:", JSON.stringify(data, null, 2))
    console.log("======================")
    
    const grid = await utilities.buildItemDetail(data)
    let nav = await utilities.getNav()
    res.render("./inventory/item", {
        title: data[0].inv_make + " " + data[0].inv_model,
        nav,
        grid,
        customCSS: "/css/detail.css"
    })
}


//BUILD VIEWS TO ADD A NEW CLASSIFICATION AND ITEM

invCont.buildManagement = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    addItemsCSS: "/css/addItems.css"
  })
}

invCont.registerClassification = async function (req, res) {
  const { classification_name } = req.body

  const regClassification = await invModel.registerClassification(
    classification_name
  )

  let nav = await utilities.getNav()

  if (regClassification) {
    req.flash("notice", "Congratulations you have added a new classification")
    res.status(201).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      addItemsCSS: "/css/addItems.css",
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null, 
      classification_name,
      addItemsCSS: "/css/addItems.css"
    })
  }
}


//BUILD VIEWS TO ADD A NEW VEHICLE
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let select = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    select,
    errors: null,
    addItemsCSS: "/css/addItems.css"
  })
}

// ...existing code...
invCont.registerInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { 
    classification_id, 
    inv_make, 
    inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color 
  } = req.body

  const regResult = await invModel.registerInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  )

  if (regResult) {
    req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    let select = await utilities.buildClassificationList(classification_id)
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      select,
      errors: null,
      ...req.body
    })
  }
}
// ...existing code...



module.exports = invCont