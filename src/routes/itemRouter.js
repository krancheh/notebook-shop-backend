const Router = require('express');
const router = new Router();
const controller = require('../controllers/itemController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/add', checkRoleMiddleware("ADMIN"), controller.add);
router.delete('/delete', checkRoleMiddleware("ADMIN"), controller.delete);
router.get('/get', controller.get);
router.get('/:id', controller.getById);

module.exports = router;

