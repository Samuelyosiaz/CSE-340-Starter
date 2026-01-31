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

module.exports = invCont