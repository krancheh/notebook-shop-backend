const ApiError = require("../error/ApiError");
const { Basket, BasketItem, Item, Brand, Type, ItemInfo } = require("../models/models");



class BasketController {

    async createBasket(req, res, next) {
        try {
            const { userId } = req.body;

            if (!userId) {
                next(ApiError.badRequest("Введите id пользователя"));
            }

            const basket = await Basket.create({ userId });
            return res.json({ basket });
        } catch (e) {
            console.log(e);
            next(ApiError.internal("Произошла ошибка"));
        }
    }

    async addItem(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { id: itemId } = req.body;

            const { id: basketId } = await Basket.findOne({ where: { userId } })

            if (!itemId || !basketId) {
                return next(ApiError.badRequest("Не указаны необходимые параметры"));
            }

            const basketItem = await BasketItem.create({ basketId, itemId });

            return res.json({ basketItem });
        } catch (e) {
            console.log(e);
            next(ApiError.internal("Произошла ошибка"));
        }
    }

    async removeItems(req, res, next) {
        try {
            const { ids } = req.body;
            const count = await BasketItem.destroy({ where: { id: ids } });
            return res.json({ message: `Удалено товаров в корзине: ${count}` });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async get(req, res, next) {
        try {
            const { id: userId } = req.user;
            const basket = await Basket.findOne({
                where: { userId },
                include: [{
                    model: BasketItem,
                    attributes: ['itemId'],
                    as: 'items',
                    include: [{
                        model: Item,
                        attributes: ['id', 'name', 'price', 'img'],
                        include: [
                            {
                                model: Brand,
                                attributes: ['name'],
                            },
                            {
                                model: Type,
                                attributes: ['name'],
                            },
                        ]
                    }]
                }]
            });

            if (!basket) {
                const { id: newBasketId } = await Basket.create({ userId });
                return res.json({ basketId: newBasketId, items: [] });
            }

            const formattedBasket = {
                items: basket.items.map(basketItem => ({
                    id: basketItem.itemId,
                    brand: basketItem.item.brand?.name,
                    type: basketItem.item.type?.name,
                    name: basketItem.item.name,
                    img: basketItem.item.img,
                    price: basketItem.item.price
                }))
            }

            return res.json({ basket: formattedBasket });
        } catch (e) {
            console.log(e);
            next(ApiError.internal("Произошла ошибка"));
        }
    }
}

module.exports = new BasketController();