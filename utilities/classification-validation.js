const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty().withMessage("Field is required")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/).withMessage("Only letters without spaces")
    ]
}

validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
            addItemsCSS: "/css/addItems.css"
        })
        return
      }
      next()
}

module.exports = validate