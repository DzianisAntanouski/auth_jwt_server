const ApiError = require('../exceptions/api-error.js')

module.exports = function (oErr, oReq, oRes, fNext) {
    console.log(oErr);
    if (oErr instanceof ApiError) {
        return oRes.status(oErr.sStatus).json({ message: oErr.message, errors: oErr.aErrors })
    }

    return oRes.status(500).json({ message: 'Something went wrong' })
}