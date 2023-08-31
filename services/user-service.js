const oUserModel = require("../models/user-model.js");
const oBcrypt = require("bcrypt");
const oUuid = require("uuid");
const oMailService = require("./mail-service.js");
const oTokenService = require("./token-service.js");
const UserDto = require("../dtos/user-dto.js");
const ApiError = require("../exceptions/api-error.js");
// const oJwt = require('jsonwebtoken');

class UserService {
    async registration(sEmail, sPassword) {
        const candidate = await oUserModel.findOne({ email: sEmail });
        if (candidate) {
            throw ApiError.badRequest("User with this email was registered");
        }

        const sHashPassword = await oBcrypt.hash(sPassword, 4);
        const sActivationLink = oUuid.v4();
        const oUser = await oUserModel.create({ email: sEmail, password: sHashPassword, activationLink: sActivationLink });
        await oMailService.sendActivationMail(sEmail, `${process.env.API_URL}/api/activate/${sActivationLink}`);

        const oUserDto = new UserDto(oUser); // id, email, isActivated
        const oTokens = oTokenService.generateToken({ ...oUserDto });
        await oTokenService.saveToken(oUserDto.id, oTokens.sRefreshToken);

        return {
            ...oTokens,
            user: oUserDto,
        };
    }

    async activate(activationLink) {
        const oUser = await oUserModel.findOne({ activationLink });
        if (!oUser) {
            throw ApiError.badRequest("Incorrect activation link");
        }
        oUser.isActivated = true;
        await oUser.save();
    }

    async login(sEmail, sPassword) {
        const oUser = await oUserModel.findOne({ email: sEmail });
        if (!oUser) {
            throw ApiError.badRequest(`User with ${sEmail} email didn\'t find`);
        }

        const bIsPasswordEqual = await oBcrypt.compare(sPassword, oUser.password);
        if (!bIsPasswordEqual) {
            throw ApiError.badRequest("Incorrect password");
        }
        const oUserDto = new UserDto(oUser);
        const oTokens = oTokenService.generateToken({ ...oUserDto });

        await oTokenService.saveToken(oUserDto.id, oTokens.sRefreshToken);

        return {
            ...oTokens,
            user: oUserDto,
        };
    }

    async logout(sRefreshToken) {
        const sToken = await oTokenService.removeToken(sRefreshToken);
        return sToken;
    }

    async refresh(sRefreshToken) {
        if (!sRefreshToken) {
            throw ApiError.unauthorizedError()
        }

        const oUserData = oTokenService.validateRefreshToken(sRefreshToken)
        const sTokenFromDb = oTokenService.findToken(sRefreshToken)

        if (!oUserData || !sTokenFromDb) {
            throw ApiError.unauthorizedError();
        }
        const oUser = await oUserModel.findById(oUserData.id)

        const oUserDto = new UserDto(oUser);
        const oTokens = oTokenService.generateToken({ ...oUserDto });

        await oTokenService.saveToken(oUserDto.id, oTokens.sRefreshToken);

        return {
            ...oTokens,
            user: oUserDto,
        };
    }

    async getAllUsers() {
        const aUsers = oUserModel.find();
        return aUsers;
    }
}

module.exports = new UserService();
