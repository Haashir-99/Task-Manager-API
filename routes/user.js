const express = require("express");

const userController = require("../controllers/user");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/", isAuth, userController.getUserInfo)

router.post("/", isAuth, userController.editUserInfo)

module.exports = router;
