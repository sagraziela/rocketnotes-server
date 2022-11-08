const { Router, request } = require("express");
const UsersController = require("../controllers/usersController");
const UserAvatarController = require('../controllers/userAvatarController');
const multer = require('multer');
const uploadConfig = require('../configs/upload');

const usersRoutes = Router();
const ensureAuthentication = require('../middlewares/ensureAuthentication');
const usersController = new UsersController();
const usersAvatarController= new UserAvatarController();

const upload = multer(uploadConfig.MULTER);

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthentication, usersController.update);
usersRoutes.patch("/", ensureAuthentication, upload.single("avatar"), usersAvatarController.update)

module.exports = usersRoutes;