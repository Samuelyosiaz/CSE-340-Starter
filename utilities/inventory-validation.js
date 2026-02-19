const utilities = require(".")
const { body, query, validationResult } = require("express-validator")
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
        .withMessage("Year must be a valid 4-digit yeamilesr"),

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

//This function is to handle an error data in the edit-inventory view
validate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let select = await utilities.buildClassificationList(req.body.classification_id)
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit" + inv_make + inv_model,
            nav,
            select,
            ...req.body, 
            addItemsCSS: "/css/addItems.css"
        })
        return
    }
    next()
}

/* ***************************
 *  Filter validation rules
 * ************************** */
validate.filterRules = () => {
    return [
        query("inv_make")
        .optional({ checkFalsy: true })
        .trim()
        .escape(),

        query("minPrice")
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^\d+(\.\d+)?$/)
        .withMessage("Minimum price must be a valid number")
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0"),

        query("maxPrice")
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^\d+(\.\d+)?$/)
        .withMessage("Maximum price must be a valid number")
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0")
        .custom((value, { req }) => {
            if (req.query.minPrice && value && parseFloat(value) < parseFloat(req.query.minPrice)) {
                throw new Error('Maximum price must be greater than minimum price')
            }
            return true
        }),

        query("minMiles")
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^\d+$/)
        .withMessage("Minimum miles must be a valid integer")
        .isInt({ min: 0 })
        .withMessage("Minimum miles must be greater than or equal to 0"),

        query("maxMiles")
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^\d+$/)
        .withMessage("Maximum miles must be a valid integer")
        .isInt({ min: 0 })
        .withMessage("Maximum miles must be greater than or equal to 0")
        .custom((value, { req }) => {
            if (req.query.minMiles && value && parseInt(value) < parseInt(req.query.minMiles)) {
                throw new Error('Maximum miles must be greater than minimum miles')
            }
            return true
        })
    ]
}

/* ***************************
 *  Check filter data and return errors or continue
 * ************************** */
validate.checkFilterData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const makesDropdown = await utilities.buildMakesList(req.query.inv_make)
        const invModel = require("../models/inventory-model")
        
        // Get all inventory to show on error
        const data = await invModel.getInventoryByFilters(null, null, null, null, null)
        const grid = await utilities.buildClassificationGrid(data)
        
        res.render("inventory/search", {
            errors,
            title: "Search Vehicles",
            nav,
            grid,
            makesDropdown,
            inv_make: req.query.inv_make || '',
            minPrice: req.query.minPrice || '',
            maxPrice: req.query.maxPrice || '',
            minMiles: req.query.minMiles || '',
            maxMiles: req.query.maxMiles || '',
            customCSS: "/css/search.css"
        })
        return
    }
    next()
}

module.exports = validate