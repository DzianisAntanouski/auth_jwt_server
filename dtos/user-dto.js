module.exports = class UserDto {
    email;
    id;
    isActivated;

    constructor(oModel) {
        this.email = oModel.email;
        this.id = oModel._id;
        this.isActivated = oModel.isActivated;
    }
}