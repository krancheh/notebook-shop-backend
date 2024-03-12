const Router = require('express');
const router = new Router();
const controller = require('../controllers/typeController');

router.post('/add', controller.add);
router.get('/get', controller.getAll);

module.exports = router;