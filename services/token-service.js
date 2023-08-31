const oJwt = require('jsonwebtoken');
const oTokenModel = require('../models/token-model.js');

class TokenService {
    generateToken(oPayload) {
        const sAccessToken = oJwt.sign(oPayload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30s' })
        const sRefreshToken = oJwt.sign(oPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return { 
            sAccessToken,
            sRefreshToken
         }
    }

    
    validateAccessToken(sToken) {
        try {
            const oUserData = oJwt.verify(sToken, process.env.JWT_ACCESS_SECRET);
            return oUserData;
        } catch (oError) {
            return null
        }
    }

    validateRefreshToken(sToken) {
        try {
            const oUserData = oJwt.verify(sToken, process.env.JWT_REFRESH_SECRET)
            return oUserData;
        } catch (oError) {
            return null
        }
    }

    async saveToken(sUserId, sRefreshToken) {
        const oTokenData = await oTokenModel.findOne({ user: sUserId });

        if(oTokenData) {
            oTokenData.refreshToken = sRefreshToken;
            return oTokenData.save();
        }

        const oToken = await oTokenModel.create({ user: sUserId, refreshToken: sRefreshToken })
        return oToken;
    }

    async removeToken(sRefreshToken) {
        const oTokenData = await oTokenModel.deleteOne({ refreshToken: sRefreshToken });
        return oTokenData;
    }

    async findToken(sRefreshToken) {
        const oTokenData = await oTokenModel.findOne({ refreshToken: sRefreshToken });
        return oTokenData;
    }
};

module.exports = new TokenService();