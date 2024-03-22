const Router = require('express');
const router = new Router();
const controller = require('../controllers/typeController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, checkRoleMiddleware("ADMIN"), controller.add);
router.delete('/delete', authMiddleware, checkRoleMiddleware("ADMIN"), controller.delete);
router.get('/', controller.getAll);

module.exports = router;