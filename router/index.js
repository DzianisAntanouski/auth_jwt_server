const Router = require("express").Router;
const oUserController = require("../controllers/user-controller.js");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware.js")

const oRouter = new Router();

oRouter.post("/registration", body("email").isEmail(), body("password").isLength({ min: 6, max: 32 }), oUserController.registration);
oRouter.post("/login", oUserController.login);
oRouter.post("/logout", oUserController.logout);
oRouter.get("/activate/:link", oUserController.activate);
oRouter.get("/refresh", oUserController.refresh);
oRouter.get("/users", authMiddleware, oUserController.getUsers);

module.exports = oRouter;
