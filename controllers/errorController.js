const utilities = require("../utilities")

const errorCont = {}

/* ***************************
 *  Trigger intentional error
 * ************************** */
errorCont.triggerError = async function (req, res, next) {
  // Crear un error intencional
  const error = new Error("This is an intentional 500 error for testing purposes")
  error.status = "Server Error"
  next(error)
}

module.exports = errorCont