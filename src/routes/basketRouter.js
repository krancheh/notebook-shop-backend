const Router = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = new Router();
const controller = require("../controllers/basketController");



router.get("/", authMiddleware, controller.get);
router.post("/create", authMiddleware, controller.createBasket);
router.post("/add", authMiddleware, controller.addItem);
router.delete("/delete", authMiddleware, controller.removeItems);

module.exports = router;