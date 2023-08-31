const ApiError = require("../exceptions/api-error.js");
const oTokenService = require("../services/token-service.js");

module.exports = function (oReq, oRes, fNext) {
    try {
        const authHeader = oReq.headers.authorization;
        if (!authHeader) return fNext(ApiError.unauthorizedError());

        const sAccessToken = authHeader.split(" ")[1];
        if (!sAccessToken) return fNext(ApiError.unauthorizedError());

        const oUserData = oTokenService.validateAccessToken(sAccessToken);
        if (!oUserData) return fNext(ApiError.unauthorizedError());

        oReq.user = oUserData;
        fNext();
    } catch (error) {
        return fNext(ApiError.unauthorizedError());
    }
};
