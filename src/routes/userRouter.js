const Router = require('express');
const router = new Router();
const controller = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.get('/auth', authMiddleware, controller.checkAuth);
router.get('/:id', controller.getById);
router.get('/', controller.getAll);


module.exports = router;