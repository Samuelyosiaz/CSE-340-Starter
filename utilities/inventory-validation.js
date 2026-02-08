const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.inventoryRules = () => {
    return [
        body("classification_id")
        .trim()
        .notEmpty()
        .withMessage("Classification is required"),

        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Make is required")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]{3,}$/)
        .withMessage("Make must contain at least 3 letters"),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Model is required")
        .matches(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]{3,}$/)
        .withMessage("Model must contain at least 3 letters or numbers"),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 10, max: 500 })
        .withMessage("Description must be between 10 and 500 characters"),

        body("inv_price")
        .trim()
        .notEmpty()
        .withMessage("Price is required")
        .matches(/^\d+(\.\d+)?$/)
        .withMessage("Price must be a valid number"),

        body("inv_year")
        .trim()
        .notEmpty()
        .withMessage("Year is required")
        .matches(/^(19|20)\d{2}$/)
        .withMessage("Year must be a valid 4-digit year"),

        body("inv_miles")
        .trim()
        .notEmpty()
        .withMessage("Miles is required")
        .matches(/^\d+$/)
        .withMessage("Miles must be numeric"),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Color is required")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]{3,20}$/)
        .withMessage("Color must be 3–20 letters only")
    ]
}

validate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let select = await utilities.buildClassificationList(req.body.classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Vehicle",
            nav,
            select,
            ...req.body, 
            addItemsCSS: "/css/addItems.css"
        })
        return
    }
    next()
}

module.exports = validate