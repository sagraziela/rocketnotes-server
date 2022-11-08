const { Router } = require("express");
const TagsController = require("../controllers/tagsController");
const ensureAuthentication = require('../middlewares/ensureAuthentication');

const tagsRoutes = Router();

const tagsController = new TagsController();

tagsRoutes.get("/", ensureAuthentication, tagsController.index);


module.exports = tagsRoutes;