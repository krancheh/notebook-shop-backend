const Router = require('express');
const router = new Router();
const controller = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/signup', controller.registration);
router.post('/login', controller.login);
router.get('/auth', authMiddleware, controller.checkAuth);
router.get('/:id', checkRoleMiddleware("ADMIN"), controller.getById);
router.get('/', checkRoleMiddleware("ADMIN"), controller.getAll);


module.exports = router;