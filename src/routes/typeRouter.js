const Router = require('express');
const router = new Router();
const controller = require('../controllers/typeController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/add', checkRoleMiddleware("ADMIN"), controller.add);
router.delete('/delete', checkRoleMiddleware("ADMIN"), controller.delete);
router.get('/', controller.getAll);

module.exports = router;