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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
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

//BUILD VIEW TO EDIT THE INVENTORY LIST
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
    addItemsCSS: "/css/addItems.css"
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.deleteItemView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
    addItemsCSS: "/css/addItems.css"
  })
}

invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`

  const updateResult = await invModel.deleteInventoryItem(inv_id)

  if (updateResult) {
    req.flash("notice", `The ${itemName} was succesfully deleted`)
    res.redirect('/inv/')
  } else {
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    req.flash("notice", "Sorry, the delete failed") 
    res.status(501).render("inventory/delete-confirm", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
    addItemsCSS: "/css/addItems.css"
  })
  }
}



module.exports = invCont