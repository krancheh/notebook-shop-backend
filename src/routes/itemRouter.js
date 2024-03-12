const Router = require('express');
const router = new Router();
const controller = require('../controllers/itemController');

router.post('/add', controller.add);
router.get('/', controller.get);
router.get('/:id', controller.getById);

module.exports = router;

