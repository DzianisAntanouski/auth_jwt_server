module.exports = class ApiError extends Error {
    sStatus;
    aErrors;

    constructor(sStatus, sMessage, aErrors = []) {
        super(sMessage);        
        this.sStatus = sStatus;
        this.aErrors = aErrors;
    }

    static unauthorizedError () {
        return new ApiError(401, 'User didn\'t authorize')
    }

    static badRequest (sMessage, aErrors = []) {
        return new ApiError(400, sMessage, aErrors)
    }
}