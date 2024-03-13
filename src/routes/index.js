const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const typeRouter = require('./typeRouter');
const brandRouter = require('./brandRouter');
const itemRouter = require('./itemRouter');
const basketRouter = require('./basketRouter');

router.use('/users', userRouter);
router.use('/types', typeRouter);
router.use('/brands', brandRouter);
router.use('/items', itemRouter);
router.use('/basket', basketRouter);


module.exports = router;