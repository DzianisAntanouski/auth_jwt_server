const ApiError = require("../exceptions/api-error.js");
const { validationResult } = require("express-validator");
const oUserService = require("../services/user-service.js");

class UserController {
    async registration(req, res, next) {
        try {
            const oErrors = validationResult(req);
            if (!oErrors.isEmpty()) {
                return next(ApiError.badRequest("Validation error", oErrors.array()));
            }
            const { email, password } = req.body;
            const oUserData = await oUserService.registration(email, password);

            res.cookie("refreshToken", oUserData.sRefreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false });
            return res.json(oUserData);
        } catch (oError) {
            next(oError);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const oUserData = await oUserService.login(email, password);

            res.cookie("refreshToken", oUserData.sRefreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
            return res.json(oUserData);
        } catch (oError) {
            next(oError);
        }
    }

    async logout(req, res, next) {
        try {
            const  { refreshToken } = req.cookies;
            const sToken = await oUserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(sToken)
        } catch (oError) {
            next(oError);
        }
    }

    async activate(req, res, next) {
        try {
            const sActivationLink = req.params.link;
            await oUserService.activate(sActivationLink);
            // return res.redirect(process.env.CLIENT_URL);
            return res.status(200).json('Activated')
        } catch (oError) {
            next(oError);
        }
    }

    async refresh(req, res, next) {
        try {
            const  { refreshToken } = req.cookies;
            const oUserData = await oUserService.refresh(refreshToken);

            res.cookie("refreshToken", oUserData.sRefreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
            return res.json(oUserData);
        } catch (oError) {
            next(oError);
        }
    }

    async getUsers(req, res, next) {
        try {
            const aUsers = await oUserService.getAllUsers()
            res.json(aUsers);
        } catch (oError) {
            next(oError);
        }
    }
}

module.exports = new UserController();
